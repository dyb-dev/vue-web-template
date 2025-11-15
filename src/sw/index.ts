/*
 * @FileDesc: Service Worker 模块
 */

/**
 * FUN: registerType: 'autoUpdate' 时需执行此函数，自动刷新页面更新ServiceWorker（注意：一定要写在入口文件最顶部）
 *
 * @author dyb-dev
 * @date 24/04/2024/  10:54:36
 */
export const setupServiceWorker = async() => {

    try {

        const { registerSW } = await import("virtual:pwa-register")

        // 当检测到sw.ts文件有更新时，会注册新的 Service Worker，并重新执行sw.ts脚本
        registerSW({
            // 立即注册
            immediate: true,
            onRegisteredSW() {

                console.log("Service Worker 注册成功")

            },
            onRegisterError() {

                console.error("Service Worker 注册失败")

            }
        })

    }
    catch (error) {

        console.error("动态加载 Service Worker 注册模块失败:", error)

    }

}
