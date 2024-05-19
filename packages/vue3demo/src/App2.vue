<script setup lang="ts">
</script>

<template>
    <div>
    </div>
</template>

<script setup lang="ts">
 interface RequestOptions {
}

// 定义接口，不负责实现
 interface Requestor {
  get(url: string, options: RequestOptions): Promise<Response>;

  post(url: string, data: any, options: RequestOptions): Promise<Response>;
}

let req: Requestor = {
  get(url: string, options: RequestOptions): Promise<Response> {

  },
  post(url: string, data: any, options: RequestOptions): Promise<Response> {
    return new Promise((resolve, reject) => {
    });
  }
}

 function inject(requestor: Requestor) {
  req = requestor;
}


 function useRequestor(): Requestor {
  return req;
}


class HttpClient implements Requestor {
  constructor() {
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  get(url: string, options: RequestOptions): Promise<Response> {
  }

  post(url: string, data: any, options: RequestOptions): Promise<Response> {
  }

  // 发送请求
  request(config) {
    // 创建一个用于处理拦截器的 Promise 链
    let chain = Promise.resolve(config);

    // 依次应用请求拦截器
    this.requestInterceptors.forEach(interceptor => {
      chain = chain.then(interceptor);
    });

    // 发送请求
    chain = chain.then(this.sendRequest);

    // 依次应用响应拦截器
    this.responseInterceptors.forEach(interceptor => {
      chain = chain.then(interceptor);
    });

    return chain;
  }

  // 模拟发送请求的方法
  sendRequest(config) {
    return new Promise((resolve, reject) => {
      // 这里模拟一个异步请求
      setTimeout(() => {
        // 模拟成功响应
        resolve({status: 200, data: {message: 'Success', config}});

        // 如果要模拟失败响应，可以使用 reject，例如：
        // reject({ status: 500, message: 'Internal Server Error' });
      }, 1000);
    });
  }
}

// 使用示例

const httpClient = new HttpClient();

// 添加请求拦截器
httpClient.addRequestInterceptor(config => {
  console.log('请求拦截器1:', config);
  config.headers = {...config.headers, Authorization: 'Bearer token'};
  return config;
});

httpClient.addRequestInterceptor(config => {
  console.log('请求拦截器2:', config);
  config.headers = {...config.headers, 'X-Custom-Header': 'custom'};
  return config;
});

// 添加响应拦截器
httpClient.addResponseInterceptor(response => {
  console.log('响应拦截器1:', response);
  response.data.receivedAt = new Date();
  return response;
});

httpClient.addResponseInterceptor(response => {
  console.log('响应拦截器2:', response);
  if (response.status !== 200) {
    return Promise.reject(response);
  }
  return response;
});

// 发送请求
httpClient.request({url: '/api/data', method: 'GET'})
  .then(response => {
    console.log('请求成功:', response);
  })
  .catch(error => {
    console.log('请求失败:', error);
  });

</script>

<style scoped>
</style>
