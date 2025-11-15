/*
 * @FileDesc: 控制 Service Worker 脚本文件
 */

import { CacheableResponsePlugin } from "workbox-cacheable-response"
import { clientsClaim } from "workbox-core"
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { NetworkFirst } from "workbox-strategies"

declare let self: ServiceWorkerGlobalScope

// 开发环境禁止打印日志信息(实在太多了...)
self.__WB_DISABLE_DEV_LOGS = true

// registerType: 'autoUpdate'时需添加此代码，自动刷新页面更新ServiceWorker
// 使新的 Service Worker 立即激活，而不需要等待之前的版本停止控制页面
self.skipWaiting()
// Service Worker 激活后立即获取控制权，而不必等待页面刷新
clientsClaim()

// 清理旧的缓存
cleanupOutdatedCaches()

// 使用预缓存和路由功能，将在 Service Worker 安装时预缓存指定的资源(页面首次加载用到)
precacheAndRoute(self.__WB_MANIFEST)

// 注册运行时get请求缓存策略
registerRoute(
    // 控制请求缓存的条件
    e => {

        return e.request.method === "GET"

    },
    // 缓存策略 NetworkFirst: 网络优先
    new NetworkFirst({
        // 缓存名
        cacheName: "get-request",
        // 网络超时时间
        networkTimeoutSeconds: 3,
        // 插件配置
        plugins: [
            new CacheableResponsePlugin({
                // 缓存条件 状态码
                statuses: [0, 200]
                // 缓存条件 请求头
                // headers: {}
            })
        ]
        // // 请求时需要额外添加的自定义参数
        // fetchOptions: {},
        // // 匹配选项
        // matchOptions: {}
    }),
    "GET"
)
