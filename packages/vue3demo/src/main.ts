import { createApp } from 'vue'
import './style.css'

// 注入
import { httpClient } from '@whale-requset/request-lib/request-axios-imp'
import { inject } from '@whale-requset/request-lib/request-core'
import App from './App3.vue'

inject(httpClient)

createApp(App).mount('#app')
