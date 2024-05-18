import {Requestor} from '../request-core'
import axios from "axios";

const request = axios.create()
export const requestor: Requestor = {
  get(url, options?) {
    // 使用axios实现
    return request.get(url, options)
  },
  post(url, data, options?) {
    // 使用axios实现
    return request.post(url, data, options)
  },
  // 其他请求方法
}

// request拦截器
request.interceptors.request.use(config => {
  return config
}, error => {
  Promise.reject(error)
})



