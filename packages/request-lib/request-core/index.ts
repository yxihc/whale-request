// NetworkClient.ts
import { defaultsDeep } from 'lodash-unified'
import { useCache } from './cache'
import { useLocationStorageCache } from './cache/imp/useLocalStorageCache'
import { useSessionStorageCache } from './cache/imp/useSessionStorageCache'
import { defaultRequestOptions } from './requestOptions'
import type { AsyncCacheStore } from './cache/asyncCacheStore'
import type { Requestor } from './requestor'
import type { CacheManager } from './cache'

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

  private defaultCacheOptions(): CacheOptions {
    const options: CacheOptions = {
      duration: 6 * 1000,
      key: (config: RequestOptions): string => {
        return this.defaultCacheKey(config)
      },
      isPersist: false,
    }
    return options
  }

  private getCacheOptions(options: CacheOptions): CacheOptions {
    const defaulOptions: CacheOptions = this.defaultCacheOptions()
    return {
      ...defaulOptions,
      ...options,
    }
  }

  private async applyCache(
    chain: Promise<RequestOptions>,
    options: RequestOptions,
    method: RequestOptionsType
  ): Promise<RequestOptions> {
    let requestCache: CacheManager
    let cacheOptions: CacheOptions

    const requestFunc = async () => {
      try {
        const response = await method(options)

        if (cacheOptions && requestCache && options.useCache) {
          requestCache.set(
            cacheOptions.key!(options),
            response,
            cacheOptions.duration
          ) // Cache the response
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
      cacheOptions = options?.cache
        ? this.getCacheOptions(options.cache)
        : this.defaultCacheOptions()

      const key = cacheOptions.key!(options)
      // 获取缓存实现类
      requestCache = useCache(cacheOptions.isPersist!)
      let cachedResponse
      if (cacheOptions.isValid) {
        if (cacheOptions.isValid(key, options)) {
          // 缓存有效
          cachedResponse = await requestCache.getNromal(
            cacheOptions.key!(options)
          )
        } else {
          // 缓存失效
          cachedResponse = undefined
        }
      } else {
        cachedResponse = await requestCache.get(key)
      }
      if (cachedResponse) {
        // 返回缓存数据
        chain = chain.then(async () => {
          return Promise.resolve(cachedResponse as RequestOptions)
        })
      } else {
        if (options.retry && options.retry > 0) {
          chain = this.retry<RequestOptions>(
            requestFunc,
            options.retry,
            options.retryInterval
              ? options.retryInterval
              : this.actualErrorRetryInterval(options.retry)
          )
        } else {
          chain = chain.then(requestFunc)
        }
      }
    } else {
      if (options.retry && options.retry > 0) {
        chain = this.retry<RequestOptions>(
          requestFunc,
          options.retry,
          options.retryInterval
            ? options.retryInterval
            : this.actualErrorRetryInterval(options.retry)
        )
      } else {
        chain = chain.then(requestFunc)
      }
    }
    return chain
  }

  private actualErrorRetryInterval(retriedCount: number) {
    if (retriedCount < 1) {
      return 0
    }
    const baseTime = 1000
    const minCoefficient = 1
    const maxCoefficient = 9
    // When retrying for the first time, in order to avoid the coefficient being 0
    // so replace 0 with 2, the coefficient range will become 1 - 2
    const coefficient = Math.floor(
      Math.random() * 2 ** Math.min(retriedCount, maxCoefficient) +
        minCoefficient
    )
    return baseTime * coefficient
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

  private defaultCacheKey(options: RequestOptions): string {
    // 请求缓存
    const cacheKey = `${options.url}_${JSON.stringify(
      options.params || {}
    )}_${JSON.stringify(options.data || {})}`
    return cacheKey
  }

  private async request(method: RequestOptionsType, options: RequestOptions) {
    // 参数归一化
    options = this.normalizeOptions(options)

    console.log(options)
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

export const requestCache = {
  memoryCache: useSessionStorageCache() as AsyncCacheStore,
  persistCache: useLocationStorageCache() as AsyncCacheStore,
}

export function injectCache(
  memoryCache: AsyncCacheStore,
  persistCache: AsyncCacheStore
) {
  requestCache.memoryCache = memoryCache
  requestCache.persistCache = persistCache
}

export default WhaleRequest
