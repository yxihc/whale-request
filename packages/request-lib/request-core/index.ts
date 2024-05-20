// NetworkClient.ts
import {Requestor} from './requestor';
import {useCache} from './cache';
import {RequestOptionsType, RequestOptions} from "./requestOptions";
import {RequestInterceptor} from "./interceptors.ts";
import {CacheItem} from "./cache/cacheItem";


class WhaleRequest implements Requestor{
  private  client: Requestor;

  static create(client: Requestor){
    return new WhaleRequest(client)
  }

  constructor(client: Requestor) {
    this.client = client;
  }

  private async applyRequestInterceptors(options: Promise<RequestOptions>): Promise<RequestOptions> {
    return this.applyInterceptors(options, this.client.requestInterceptors)
  }

  private async applyResponseInterceptors(options: Promise<RequestOptions>): Promise<RequestOptions> {
    return this.applyInterceptors(options, this.client.responseInterceptors)
  }

  private async applyInterceptors(options: Promise<RequestOptions>, interceptors?: RequestInterceptor[]): Promise<RequestOptions> {
    if (interceptors) {
      interceptors?.forEach(interceptor => {
        options = options.then(interceptor);
      });
    }
    return options;
  }

  private async applyErrorInterceptors(error: any): Promise<any> {
    if (this.client.errorInterceptors) {
      for (const interceptor of this.client.errorInterceptors) {
        error = await interceptor(error);
      }
    }
    return Promise.reject(error);
  }


  private async applyCache(chain: Promise<RequestOptions>,options:RequestOptions,method: RequestOptionsType,): Promise<RequestOptions> {
    if (options.cache&&options.cache.useCache){
      const  config = options.cache
      // 获取缓存的key
      let key=''
      if (config.key){
        key = config.key(options)
      }else{
        key = this.defaultCacheKey(options)
      }

      // 获取缓存实现类
      const requestCache = useCache(config.isPersist)

      // const hasKey = await requestCache.has(key); // 是否存在缓存
      // if(hasKey && config.isValid?.(key, options)){  // 存在缓存并且缓存有效
      //   // 返回缓存结果
      // }

      const cachedResponse = await requestCache.get(key);
      let valid= true
      if (config.isValid){
        valid = config.isValid(key, options)
      }else {
        valid = true
      }
      if (cachedResponse&&valid) {
        chain = chain.then(async () => {
          return Promise.resolve(cachedResponse)
        });
      } else {
        // 发送请求（由使用者编写方法，必须返回promis）
        let requestFunc = async () => {
          try {
            let response = await method(options);
            requestCache.set(key, response,config.duration?config.duration:60000); // Cache the response
            return response;
          } catch (error) {
            await this.applyErrorInterceptors(error);
          }
        };
        chain = chain.then(requestFunc);
      }
    }else{
      chain = chain.then(method);
    }
    return chain;
  }

  private defaultCacheKey(options: RequestOptions):string{
    // 请求缓存
    const cacheKey = `${options.url}_${JSON.stringify(options.params || {})}_${JSON.stringify(options.data || {})}`;
    return cacheKey
  }

  private async requestWrapper(
    method: RequestOptionsType,
    options: RequestOptions,
  ) {
    let chain = Promise.resolve(options);
    // 依次应用请求拦截器
    chain = this.applyRequestInterceptors(chain)

    // 请求缓存
    // const cacheKey = `${options.url}_${JSON.stringify(options.params || {})}_${JSON.stringify(options.data || {})}`;

    chain = this.applyCache(chain, options, method);

    // const cachedResponse = useCache(options.cache).get(cacheKey);
    // if (cachedResponse) {
    //   chain = chain.then(async () => {
    //     return Promise.resolve(cachedResponse)
    //   });
    // } else {
    //   // 发送请求（由使用者编写方法，必须返回promis）
    //   let requestFunc = async () => {
    //     try {
    //       let response = await method(options);
    //       requestCache.set(cacheKey, response); // Cache the response
    //       return response;
    //     } catch (error) {
    //       await this.applyErrorInterceptors(error);
    //     }
    //   };
    //   chain = chain.then(requestFunc);
    // }

    // 依次应用响应拦截器
    chain = this.applyResponseInterceptors(chain)
    return chain
  }

  //  get(url:string,options: RequestOptions) {
  //    console.log(url)
  //   return this.requestWrapper(this.client.get(url, options), options)
  // }

  get(options: RequestOptions) {
    return this.requestWrapper(this.client.get,options);
  }

  async post(options: RequestOptions) {
    return this.requestWrapper(this.client.post, options)
  }
}


// 本模块的大部分功能都需要使用到requestor
export let whaleRequest: WhaleRequest;

export function inject(requestor: Requestor) {
  whaleRequest = WhaleRequest.create(requestor)
}


export function useRequestor(): Requestor {
  return whaleRequest;
}


export default WhaleRequest;
