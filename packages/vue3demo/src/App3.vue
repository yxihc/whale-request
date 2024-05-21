<script setup lang="ts">
</script>

<template>
    <div>
    </div>
</template>

<script setup lang="ts">
// 使用封装库

// import {httpClient} from './http/imp/userImplementation.ts'
// import {useRequestor, whaleRequest} from "./http/NetworkClient.ts";

// import {httpClient} from '@whale-requset/request-lib/request-axios-imp'
// import {inject,whaleRequest,useRequestor} from "@whale-requset/request-lib/request-core";
// inject(httpClient)

import {whaleRequest} from "@whale-requset/request-lib/request-core";
import {RequestOptions} from "@whale-requset/request-lib/request-core/requestOptions.ts";

getData()
//
// setTimeout(() => {
//   console.log('===========================第二次===========================')
//   getData()
// }, 1000)


function getData() {
  const url = 'http://jsonplaceholder.typicode.com/posts1'

  whaleRequest.get({
    url: url,
    headers: {},
    data: {},
    retry: 2,
    useCache: true,
    cache: {
      duration: 5000,
      isPersist: true
    },
  }).then(data => {
    console.log('示例请求成功:', data);
  }).catch(error => {
    console.log('示例请求失败:', error);
  })
}

function testPost() {
  const url = 'http://jsonplaceholder.typicode.com/posts'
  let formdata = new FormData()
  formdata.append("1", "1")
}

//
// networkClient.get({ url: url, data: { key: 'value' } }).then(data => {
//   console.log('POST Response:', data);
// });




// 定义 RequestParams 类型别名
type RequestParams = {
    url: string;
    headers: Record<string, string>;
    data: Record<string, any>;
    retry: number;
    useCache: boolean;
    te:boolean,
    cache: {
        duration: number;
        isPersist: boolean;
    };
}

// 定义 performRequest 函数，并指定参数类型为 RequestParams
function performRequest(options: RequestParams) {
    // 实际执行请求的逻辑
}



</script>

<style scoped>
</style>
