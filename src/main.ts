/*
 * @Author: dyb-dev
 * @Date: 2023-11-09 20:58:09
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 21:02:08
 * @FilePath: /web-mobile-template/src/main.ts
 * @Description: 程序入口文件
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
import { isEnableDebug } from "@/utils"

import { setupApi } from "./apis"

/** TODO: 如果需要使用 PWA 则解开此段代码 */
// setupServiceWorker()

// 启用调试时
if (isEnableDebug()) {

    import("vconsole")
        .then(({ default: VConsole }) => {

            window.vConsole = new VConsole()

            console.log("[项目信息]", __PROJECT_INFO__)

        })
        .catch(error => {

            console.error("VConsole 加载失败", error)

        })

}

// 创建应用
const app = createApp(App)

// 使用路由
app.use(router)

// 使用商店
app.use(store)

// 使用 Lazyload 组件,实现图片懒加载
app.use(Lazyload, { lazyComponent: true })

// 设置接口配置
setupApi()

// 挂载
app.mount("#app")
