// NetworkClient.ts
import {HttpClient} from './HttpClient';
import {requestCache} from './Cache';
import {RequestOptionsType, RequestOptions} from "./RequestOptions.ts";
import {RequestInterceptor} from "./Interceptors.ts";


class NetworkClient implements HttpClient{
  private  client: HttpClient;

  static create(client: HttpClient){
    return new NetworkClient(client)
  }

  constructor(client: HttpClient) {
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

  private async requestWrapper(
    method: RequestOptionsType,
    options: RequestOptions,
  ) {
    let chain = Promise.resolve(options);
    // 依次应用请求拦截器
    chain = this.applyRequestInterceptors(chain)

    // 请求缓存
    const cacheKey = `${options.url}_${JSON.stringify(options.params || {})}_${JSON.stringify(options.data || {})}`;
    const cachedResponse = requestCache.get(cacheKey);
    if (cachedResponse) {
      console.log('使用缓存了')
      chain = chain.then(async () => {
        return Promise.resolve(cachedResponse)
      });
    } else {
      // 发送请求（由使用者编写方法，必须返回promis）
      let requestFunc = async () => {
        try {
          let response = await method(options);
          requestCache.set(cacheKey, response); // Cache the response
          return response;
        } catch (error) {
          await this.applyErrorInterceptors(error);
        }
      };
      chain = chain.then(requestFunc);
    }

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
export let whaleRequest: NetworkClient;

export function inject(requestor: HttpClient) {
  whaleRequest = NetworkClient.create(requestor)
}


export function useRequestor(): HttpClient {
  return whaleRequest;
}


export default NetworkClient;
