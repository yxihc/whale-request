<template>
  <div>测试</div>
</template>
<script setup lang="ts">
// 使用封装库
import { regUser } from './http/request-bus'

getData()

setTimeout(() => {
  console.log('===========================第二次===========================')
  getData()
}, 1000)

function getData() {
  const url = 'http://jsonplaceholder.typicode.com/posts'
  regUser(url)
    .then((data) => {
      console.log('示例请求成功:', data)
    })
    .catch((error) => {
      console.log('示例请求失败:', error)
    })
}
</script>

<style scoped></style>
