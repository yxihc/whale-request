import { createApp } from 'vue'
import './style.css'

// 注入
import {
  inject,
  injectCache,
  setGlobalOptions,
  useLocationStorageCache,
  useSessionStorageCache,
} from '@whale-requset/request-lib'
import { httpClient } from './http/request-axios-imp'

import App from './App.vue'

injectCache(useSessionStorageCache(), useLocationStorageCache())
inject(httpClient)

setGlobalOptions({
  useCache: false,
  retry: 0,
})

createApp(App).mount('#app')
