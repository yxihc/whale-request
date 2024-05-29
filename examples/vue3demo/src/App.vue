<template>
  <div>测试</div>
</template>
<script setup lang="ts">
// // 使用封装库
// import { regUser } from './http/request-bus'
//
// getData()
//
// setTimeout(() => {
//   console.log('===========================第二次===========================')
//   getData()
// }, 1000)
//
// function getData() {
//   const url = 'http://jsonplaceholder.typicode.com/posts'
//   regUser(url)
//     .then((data) => {
//       console.log('示例请求成功:', data)
//     })
//     .catch((error) => {
//       console.log('示例请求失败:', error)
//     })
// }
// Function to download the file using Fetch API
async function downloadFile(url) {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    console.log(blob)
    // const urlBlob = URL.createObjectURL(blob)
    //
    // // Create a hidden anchor element
    // const anchor = document.createElement('a')
    // anchor.href = urlBlob
    // anchor.download = '' // Ensures the browser will use the correct filename from the server
    // document.body.appendChild(anchor)
    // anchor.click()
    //
    // // Clean up
    // document.body.removeChild(anchor)
    // URL.revokeObjectURL(urlBlob)
  } catch (error) {
    console.error('Error downloading the file:', error)
  }
}

// URL of the file to download/

let fileUrl = '/api/fileView?id=8535'

fileUrl = '/pm/file/download?fileId=8738'
// Call the function to download the file
downloadFile(fileUrl)
</script>

<style scoped></style>
