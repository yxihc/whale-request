<script setup lang="ts">
</script>

<template>
    <div>
    </div>
</template>

<script setup lang="ts">

// 使用封装库

import {RequestMethod} from "./http/RequestOptions.ts";
import NetworkClient from "./http/NetworkClient.ts";
import {httpClient} from './http/imp/userImplementation.ts'
const networkClient = new NetworkClient(httpClient);


const url = 'http://jsonplaceholder.typicode.com/posts'
// 示例请求
networkClient.get({ url: url }).then(data => {
  console.log('示例请求成功:', data);
});

//
// networkClient.get({ url: url, data: { key: 'value' } }).then(data => {
//   console.log('POST Response:', data);
// });


</script>

<style scoped>
</style>
