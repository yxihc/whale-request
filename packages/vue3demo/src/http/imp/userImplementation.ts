// userImplementation.ts
import axios from 'axios';
import {RequestMethod, RequestOptions} from "../RequestOptions.ts";

const axiosGet: RequestMethod = async ({ url, params, headers }) => {
    return axios.get(url, { params, headers });
};

const axiosPost: RequestMethod = async ({ url, data, headers }) => {
    return axios.post(url, data, { headers });
};

const requestInterceptors = [
    (options: RequestOptions) => {
        console.log('请求拦截器:', options);
        // Example interceptor: Add a custom header
        options.headers = { ...options.headers, 'X-Custom-Header': 'value' };
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

export const httpClient = {
    get: axiosGet,
    post: axiosPost,
    requestInterceptors,
    responseInterceptors,
    errorInterceptors,
};


// 使用封装库
// import NetworkClient from './NetworkClient';
// import {RequestMethod} from "../RequestOptions.ts";
//
// const networkClient = new NetworkClient(httpClient);
//
// // 示例请求
// networkClient.get({ url: 'https://api.example.com/data' }).then(data => {
//     console.log('GET Response:', data);
// });
//
// networkClient.post({ url: 'https://api.example.com/data', data: { key: 'value' } }).then(data => {
//     console.log('POST Response:', data);
// });
