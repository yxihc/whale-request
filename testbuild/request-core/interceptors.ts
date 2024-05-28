import type { RequestOptions } from './requestOptions'

export type RequestInterceptor = (
  options: RequestOptions
) => RequestOptions | Promise<RequestOptions>
export type ResponseInterceptor = (response: any) => any | Promise<any>
export type ErrorInterceptor = (error: any) => any | Promise<any>
