import {createApp} from 'vue'
import './style.css'
import App from './App.vue'



// 注入
import {inject} from '@whale-requset/request-lib/request-core'
import {requestor} from '@whale-requset/request-lib/request-axios-imp'
inject(requestor);

createApp(App).mount('#app')
