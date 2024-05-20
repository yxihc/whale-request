import {createApp} from 'vue'
import './style.css'
import App from './App.vue'



// 注入
import {httpClient} from '@whale-requset/request-lib/request-axios-imp'
import {inject,whaleRequest,useRequestor} from "@whale-requset/request-lib/request-core";
inject(httpClient)


createApp(App).mount('#app')
