import './assets/main.css'
// import './assets/normalize.css'
import { createApp } from 'vue'
// 本地SVG图标
import 'virtual:svg-icons-register'

import pinia from './store/store'
import App from './App.vue'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css'
import 'element-plus/dist/index.css';
import mitt from 'mitt'
const bus = mitt()
const app = createApp(App)
app.config.globalProperties.$bus = bus
app.use(pinia)
app.use(router)
app.use(Vant)

app.mount('#app')
