/*
 * @Author: dyb-dev
 * @Date: 2024-10-15 17:36:19
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-16 11:39:15
 * @FilePath: /web-mobile-template/src/router/guard/login.ts
 * @Description: 路由登录守卫模块
 */

import { useUserInfoStoreWithOut } from "@/stores"

import type { Router } from "vue-router"

/**
 * FUN: 设置登录守卫
 *
 * @author dyb-dev
 * @date 16/10/2024/  11:39:10
 * @param {Router} router - 路由
 */
const setupLoginGuard = (router: Router): void => {

    const { VITE_LOGIN_ROUTE, VITE_NEED_LOGIN_ROUTES } = __PROJECT_INFO__.env

    /** 需要登录的路由列表 */
    const _needLoginRouteList = VITE_NEED_LOGIN_ROUTES.split(",")

    const { userInfoStoreState } = useUserInfoStoreWithOut()

    router.beforeEach(to => {

        // 如果未登录且目标路由在需要登录的路由列表中，则跳转至登录页
        if (!userInfoStoreState.isLogin && _needLoginRouteList.includes(to.path)) {

            return {
                path: VITE_LOGIN_ROUTE,
                query: {
                    ...to.query,
                    redirectRoute: to.path
                }
            }

        }

        return true

    })

}

export { setupLoginGuard }
