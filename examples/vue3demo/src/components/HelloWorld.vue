<script setup lang="ts">
import { ref } from 'vue'

// import {publishArticle} from '@whale-requset/request-lib-bus'
// console.log(publishArticle)

import { regUser } from '@whale-requset/request-lib/request-lib-bus'

defineProps<{ msg: string }>()

const count = ref(0)
// console.log(regUser)
regUser('https://muzi.hzwmhp.com:457/htalk1/api/food/getCategoryList')
  .then((res: any) => {
    console.log(res)
  })
  .catch((error: any) => {
    console.log(error)
  })
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
