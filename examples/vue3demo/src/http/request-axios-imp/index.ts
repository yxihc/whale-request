import axios from 'axios'
import type { RequestOptions, Requestor } from '@whale-requset/request-lib'

const requestInterceptors = [
  (options: RequestOptions) => {
    console.log('请求拦截器:', options)
    // options.headers = { ...options.headers, 'X-Custom-Header': 'value' }
    return options
  },
]

const responseInterceptors = [
  (response: any) => {
    console.log('响应拦截器:', response)
    return response.data
  },
]

const errorInterceptors = [
  (error: any) => {
    console.log('错误拦截器:', error)
    return Promise.reject(error)
  },
]

export const httpClient: Requestor = {
  get: (options: RequestOptions) => {
    return axios.get(options.url || '', { headers: options.headers })
  },
  post: ({ url = '', data, headers }: RequestOptions) => {
    return axios.post(url, data, { headers })
  },
  requestInterceptors,
  responseInterceptors,
  errorInterceptors,
}
