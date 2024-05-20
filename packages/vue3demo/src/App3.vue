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




getData()

// setTimeout(() => {
//   console.log('===========================第二次===========================')
//   getData()
// }, 2000)

function getData() {
  const url = 'http://jsonplaceholder.typicode.com/posts'
// 示例请求
  whaleRequest.get({
    url: url, headers: {}, data: {}
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


</script>

<style scoped>
</style>
