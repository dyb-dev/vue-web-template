/*
 * @FileDesc: 程序入口文件
 */

import "vant/lib/index.css"
import "@dyb-dev/vant-pro/dist/style.css"
import "./styles/index.scss"

import { Lazyload } from "vant"
import { createApp } from "vue"

import App from "@/App.vue"
import { router } from "@/router"
import { store } from "@/stores"
// import { setupServiceWorker } from "@/sw"

/** TODO: 如果需要使用 PWA 则解开此段代码 */
// setupServiceWorker()

// 创建应用
const app = createApp(App)

// 使用路由
app.use(router)

// 使用商店
app.use(store)

// 使用 Lazyload 组件,实现图片懒加载
app.use(Lazyload, { lazyComponent: true })

// 挂载
app.mount("#app")
