// NetworkClient.ts
import {HttpClient} from './HttpClient';
import {requestCache} from './Cache';
import {RequestMethod, RequestOptions} from "./RequestOptions.ts";
import {RequestInterceptor} from "./Interceptors.ts";

class NetworkClient {
  private client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  // private async applyRequestInterceptors1(options: RequestOptions): Promise<RequestOptions> {
  //   if (this.client.requestInterceptors) {
  //     for (const interceptor of this.client.requestInterceptors) {
  //       options = await interceptor(options);
  //     }
  //   }
  //   return options;
  // }
  //
  // private async applyResponseInterceptors1(response: any): Promise<any> {
  //   if (this.client.responseInterceptors) {
  //     for (const interceptor of this.client.responseInterceptors) {
  //       response = await interceptor(response);
  //     }
  //   }
  //   return response;
  // }

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
    method: RequestMethod,
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

  async get(options: RequestOptions) {
    return this.requestWrapper(this.client.get, options)
  }

  async post(options: RequestOptions) {
    return this.requestWrapper(this.client.post, options)
  }
}

export default NetworkClient;
