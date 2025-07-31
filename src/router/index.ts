/*
 * @Author: dyb-dev
 * @Date: 2023-11-08 15:55:25
 * @LastEditors: v_zhgtzhong
 * @LastEditTime: 2025-08-01 00:08:12
 * @FilePath: /vue-web-template/src/router/index.ts
 * @Description: 路由模块
 */

import { createRouter, createWebHistory } from "vue-router"
import { routes } from "vue-router/auto-routes"

import { setupGuard } from "./guard"

const { VITE_BASE_PATH, VITE_HOME_ROUTE, VITE_HTML_FILE_TYPE } = __PROJECT_INFO__.env

/** router 实例 */
export const router = createRouter({
    history: createWebHistory(VITE_BASE_PATH),
    routes: [
        ...routes,
        // 网站首次进入时 `/` 重定向至首页路由
        {
            path: "/",
            redirect: VITE_HOME_ROUTE
        },
        {
            path: `/index.${VITE_HTML_FILE_TYPE}`,
            redirect: VITE_HOME_ROUTE
        }
    ],
    scrollBehavior() {

        // 禁止页面跳转时滚动位置自动重置，手动在 `App.vue` 中设置滚动位置，避免页面进行过渡动画时异常
        return false

    }
})

// 设置路由守卫
setupGuard(router)
