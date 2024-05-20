import {RequestInterceptor, ResponseInterceptor, ErrorInterceptor} from './Interceptors.ts';
import {RequestOptionsType} from "./RequestOptions.ts";

export interface HttpClient {
  get: RequestOptionsType;
  post: RequestOptionsType;
  put?: RequestOptionsType;
  delete?: RequestOptionsType;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}