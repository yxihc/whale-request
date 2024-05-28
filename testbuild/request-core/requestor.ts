import type {
  ErrorInterceptor,
  RequestInterceptor,
  ResponseInterceptor,
} from './interceptors'
import type { RequestOptionsType } from './requestOptions'

export interface Requestor {
  get: RequestOptionsType
  post: RequestOptionsType
  put?: RequestOptionsType
  delete?: RequestOptionsType
  requestInterceptors?: RequestInterceptor[]
  responseInterceptors?: ResponseInterceptor[]
  errorInterceptors?: ErrorInterceptor[]
}
