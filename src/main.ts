import './assets/main.css'
// import './assets/normalize.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 本地SVG图标
import 'virtual:svg-icons-register'


import App from './App.vue'
import router from './router'
import Vant from 'vant';
import 'vant/lib/index.css'
import 'element-plus/dist/index.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Vant)

app.mount('#app')
