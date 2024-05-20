// userImplementation.ts
import axios from 'axios';
import {RequestOptions} from "../request-core/requestOptions";
import {Requestor} from "../request-core/requestor.ts";


const requestInterceptors = [
  (options: RequestOptions) => {
    console.log('请求拦截器:', options);
    // Example interceptor: Add a custom header
    options.headers = {...options.headers, 'X-Custom-Header': 'value'};
    return options;
  },
];

const responseInterceptors = [
  (response: any) => {
    console.log('响应拦截器:', response);
    return response.data;
  },
];

const errorInterceptors = [
  (error: any) => {
    // Example interceptor: Handle errors
    console.log('错误拦截器:', error);
    return Promise.reject(error);
  },
];

export const httpClient: Requestor = {
  get: (options: RequestOptions) => {
    return axios.post(options.url, options.data, {headers: options.headers});
  },
  post: ({url, data, headers}: RequestOptions) => {
    return axios.post(url, data, {headers});
  },
  requestInterceptors,
  responseInterceptors,
  errorInterceptors,
};



