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

import { whaleRequest } from '@whale-requset/request-lib/request-core'

getData()
//
// setTimeout(() => {
//   console.log('===========================第二次===========================')
//   getData()
// }, 1000)

function getData() {
  const url = 'http://jsonplaceholder.typicode.com/posts'
  whaleRequest
    .get({
      url,
    })
    .then((data) => {
      return whaleRequest.get({
        url: 'http://jsonplaceholder.typicode.com/posts1',
      })
    })
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.log('示例请求失败:', error)
    })
}
</script>

<style scoped></style>
