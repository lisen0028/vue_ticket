import { createApp } from 'vue'
import App from './App.vue';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router.js";
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from './plugins/persistedState'


import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建应用实例
const app = createApp(App); // 正确地传递App.vue组件
const pinia = createPinia()

// 注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

pinia.use(createPersistedStatePlugin('user-store'))
// 创建 Pinia 实例

app.use(pinia)
// 注册 ElementPlus
app.use(ElementPlus)

// 注册路由
app.use(router)

// 挂载到DOM
app.mount('#app')
