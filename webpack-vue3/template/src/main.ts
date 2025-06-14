import 'element-plus/dist/index.css'
import '@/assets/style/reset.css'
import '@/styles/index.scss'
import 'uno.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import store from '@/stores'
import router from '@/router'
import ElementPlus from 'element-plus'
import './permission'

const app = createApp(App)
app.use(ElementPlus)
app.use(store)
app.use(router)

app.mount('#app')
