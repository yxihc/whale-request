import { defaultsDeep } from 'lodash-es'
import { useCache } from '../request-cache'
import { defaultRequestOptions, getDefaultCacheOptions } from './requestOptions'
import { actualErrorRetryInterval } from './utils'
import type { CacheManager } from '../request-cache'
import type { Requestor } from './requestor'
import type {
  CacheOptions,
  RequestOptions,
  RequestOptionsType,
} from './requestOptions'
import type { RequestInterceptor } from './interceptors'

class WhaleRequest implements Requestor {
  private client: Requestor

  static create(client: Requestor) {
    return new WhaleRequest(client)
  }

  constructor(client: Requestor) {
    this.client = client
  }

  private async applyRequestInterceptors(
    options: Promise<RequestOptions>
  ): Promise<RequestOptions> {
    return this.applyInterceptors(options, this.client.requestInterceptors)
  }

  private async applyResponseInterceptors(
    options: Promise<RequestOptions>
  ): Promise<RequestOptions> {
    return this.applyInterceptors(options, this.client.responseInterceptors)
  }

  private async applyInterceptors(
    options: Promise<RequestOptions>,
    interceptors?: RequestInterceptor[]
  ): Promise<RequestOptions> {
    if (interceptors) {
      interceptors?.forEach((interceptor) => {
        options = options.then(interceptor)
      })
    }
    return options
  }

  private async applyErrorInterceptors(error: any): Promise<any> {
    if (this.client.errorInterceptors) {
      for (const interceptor of this.client.errorInterceptors) {
        error = await interceptor(error)
      }
    }
    return Promise.reject(error)
  }

  private async getCachedResponse(
    requestCache: CacheManager | undefined,
    options: RequestOptions,
    cacheOptions: CacheOptions
  ): Promise<RequestOptions | undefined> {
    if (!requestCache || !cacheOptions) return undefined
    if (!requestCache.has(cacheOptions.key!(options))) {
      return undefined
    }
    const key = cacheOptions.key!(options)
    if (cacheOptions.isValid) {
      if (cacheOptions.isValid(key, options)) {
        return requestCache.getNormal(key)
      }
    } else {
      return requestCache.get(key)
    }
    return undefined
  }

  private async applyCache(
    chain: Promise<RequestOptions>,
    options: RequestOptions,
    method: RequestOptionsType
  ): Promise<RequestOptions> {
    const cacheOptions: CacheOptions =
      options?.cache || getDefaultCacheOptions()
    const requestCache: CacheManager = useCache(cacheOptions.isPersist!)

    const requestFunc = async () => {
      try {
        const response = await method(options)

        if (cacheOptions && requestCache && options.useCache) {
          requestCache.set(
            cacheOptions.key!(options),
            response,
            cacheOptions.duration
          )
        }
        return response
      } catch (error) {
        if (options.retry && options.retry > 0) {
          throw error
        } else {
          await this.applyErrorInterceptors(error)
        }
      }
    }

    if (options?.useCache) {
      const cachedResponse = await this.getCachedResponse(
        requestCache,
        options,
        cacheOptions
      )
      if (cachedResponse) {
        // 返回缓存数据
        chain = chain.then(async () => {
          return Promise.resolve(cachedResponse as RequestOptions)
        })
        return chain
      }
    }

    if (options?.retry && options.retry > 0) {
      chain = this.retry<RequestOptions>(
        requestFunc,
        options.retry,
        options.retryInterval
          ? options.retryInterval
          : actualErrorRetryInterval(options.retry)
      )
    } else {
      chain = chain.then(requestFunc)
    }
    return chain
  }

  private async retry<T>(
    fn: () => Promise<T>,
    retries: number,
    interval: number
  ): Promise<T> {
    let attempts = 0
    while (attempts < retries) {
      try {
        return await fn()
      } catch (error) {
        attempts++
        if (attempts >= retries) {
          await this.applyErrorInterceptors(error)
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, interval))
      }
    }
    throw new Error('Exceeded maximum retries')
  }

  private async request(method: RequestOptionsType, options: RequestOptions) {
    // 参数归一化
    options = this.normalizeOptions(options)

    let chain = Promise.resolve(options)

    // 依次应用请求拦截器
    chain = this.applyRequestInterceptors(chain)

    // 缓存管理
    chain = this.applyCache(chain, options, method)

    // 依次应用响应拦截器
    chain = this.applyResponseInterceptors(chain)

    return chain
  }

  private normalizeOptions(options: RequestOptions): RequestOptions {
    return defaultsDeep(options, defaultRequestOptions)
  }

  get(options: RequestOptions) {
    return this.request(this.client.get, options)
  }

  async post(options: RequestOptions) {
    return this.request(this.client.post, options)
  }
}

// 本模块的大部分功能都需要使用到requestor
export let whaleRequest: WhaleRequest

export function inject(requestor: Requestor) {
  whaleRequest = WhaleRequest.create(requestor)
}

export function useRequestor(): Requestor {
  return whaleRequest
}

export function setGlobalOptions(options: RequestOptions) {
  Object.keys(options).forEach((key) => {
    ;(defaultRequestOptions as any)[key] = (options as any)[key]
  })
}

export default WhaleRequest
