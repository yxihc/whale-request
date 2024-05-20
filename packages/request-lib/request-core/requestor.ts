import {RequestInterceptor, ResponseInterceptor, ErrorInterceptor} from './Interceptors.ts';
import {RequestOptionsType} from "./requestOptions.ts";

export interface Requestor {
  get: RequestOptionsType;
  post: RequestOptionsType;
  put?: RequestOptionsType;
  delete?: RequestOptionsType;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  errorInterceptors?: ErrorInterceptor[];
}