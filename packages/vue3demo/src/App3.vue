<template>
  <div>测试</div>
</template>
<script setup lang="ts">
// 使用封装库

// import {httpClient} from './http/imp/userImplementation.ts'
// import {useRequestor, whaleRequest} from "./http/NetworkClient.ts";

// import {httpClient} from '@whale-requset/request-lib/request-axios-imp'
// import {inject,whaleRequest,useRequestor} from "@whale-requset/request-lib/request-core";
// inject(httpClient)

import {
  setGlobalOptions,
  whaleRequest,
} from '@whale-requset/request-lib/request-core'
// setGlobalOptions({
//   url: '111111',
//   useCache: false,
//   cache: {
//     isPersist: false,
//     key(config) {
//       return `${config?.url}`
//     },
//   },
// })
getData()
//
// setTimeout(() => {
//   console.log('===========================第二次===========================')
//   getData()
// }, 1000)

function getData() {
  const url = 'http://jsonplaceholder.typicode.com/posts1'
  whaleRequest
    .get({
      url,
      retry: 3,
      retryInterval: 1000,
    })
    .then((data) => {
      // return whaleRequest.get({
      //   url: 'http://jsonplaceholder.typicode.com/posts1',
      // })
      console.log('示例请求成功:', data)
    })
    .catch((error) => {
      console.log('示例请求失败:', error)
    })
}
</script>

<style scoped></style>
