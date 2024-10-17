/*
 * @Author: dyb-dev
 * @Date: 2023-11-08 15:55:25
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-16 11:28:36
 * @FilePath: /web-mobile-template/src/router/index.ts
 * @Description: 路由模块
 */

import { createRouter, createWebHashHistory } from "vue-router"
import { routes } from "vue-router/auto-routes"

import { getCurrentUrlQuery } from "@/utils"

import { setupGuard } from "./guard"

const { VITE_BASE_PATH, VITE_HOME_ROUTE } = __PROJECT_INFO__.env

/** router 实例 */
const router = createRouter({
    history: createWebHashHistory(VITE_BASE_PATH),
    routes: [
        ...routes,
        // 网站首次进入时 `/` 重定向至首页路由
        {
            path: "/",
            redirect: () => {

                return {
                    path: VITE_HOME_ROUTE,
                    // 将首次进入的查询参数传递给首页
                    query: getCurrentUrlQuery()
                }

            }
        }
    ],
    scrollBehavior() {

        // 禁止页面跳转时滚动位置自动重置，手动在 `App.vue` 中设置滚动位置，避免页面进行过渡动画时异常
        return false

    }
})

// 设置路由守卫
setupGuard(router)

export { router }
