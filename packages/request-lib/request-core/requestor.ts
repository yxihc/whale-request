import {
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './interceptors'
import { RequestOptionsType } from './requestOptions'

export interface Requestor {
  get: RequestOptionsType
  post: RequestOptionsType
  put?: RequestOptionsType
  delete?: RequestOptionsType
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
  errorInterceptors?: ErrorInterceptor[]
}
