// NetworkClient.ts
import { HttpClient } from './HttpClient';
import { debounce, throttle, idempotentRequest } from './utils';
import { requestCache } from './Cache';
import {RequestMethod, RequestOptions} from "./RequestOptions.ts";

class NetworkClient {
    private client: HttpClient;
    private debounceTime: number;
    private throttleTime: number;

    constructor(client: HttpClient, debounceTime = 300, throttleTime = 300) {
        this.client = client;
        this.debounceTime = debounceTime;
        this.throttleTime = throttleTime;
    }

    private async applyRequestInterceptors(options: RequestOptions): Promise<RequestOptions> {
        if (this.client.requestInterceptors) {
            for (const interceptor of this.client.requestInterceptors) {
                options = await interceptor(options);
            }
        }
        return options;
    }

    private async applyResponseInterceptors(response: any): Promise<any> {
        if (this.client.responseInterceptors) {
            for (const interceptor of this.client.responseInterceptors) {
                response = await interceptor(response);
            }
        }
        return response;
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
        idempotentKey?: string
    ) {
        options = await this.applyRequestInterceptors(options);

        // Check cache first
        // const cacheKey = `${options.url}_${JSON.stringify(options.params || {})}_${JSON.stringify(options.data || {})}`;
        // const cachedResponse = requestCache.get(cacheKey);
        // if (cachedResponse) {
        //     return cachedResponse;
        // }

        let requestFunc = async () => {
            try {
                let response = await method(options);
                response = await this.applyResponseInterceptors(response);
                // requestCache.set(cacheKey, response); // Cache the response
                return response;
            } catch (error) {
                await this.applyErrorInterceptors(error);
            }
        };

        if (idempotentKey) {
            requestFunc = () => idempotentRequest(idempotentKey, requestFunc);
        }

        return requestFunc();
    }

    async get(options: RequestOptions, idempotentKey?: string) {
        const wrappedRequest = debounce(
            () => this.requestWrapper(this.client.get, options, idempotentKey),
            this.debounceTime
        );
        return wrappedRequest();
    }

    async post(options: RequestOptions, idempotentKey?: string) {
        const wrappedRequest = throttle(
            () => this.requestWrapper(this.client.post, options, idempotentKey),
            this.throttleTime
        );
        return wrappedRequest();
    }
}

export default NetworkClient;
