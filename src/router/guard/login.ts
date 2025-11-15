/*
 * @FileDesc: 路由登录守卫模块
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
export const setupLoginGuard = (router: Router): void => {

    const { VITE_LOGIN_ROUTE } = __PROJECT_INFO__.env

    const { userInfoStoreState, checkLogin } = useUserInfoStoreWithOut()

    router.beforeEach(async to => {

        // 检查当前路由是否需要登录权限
        const requireAuth = to.meta?.requireAuth ?? false

        // 如果不需要登录权限，直接放行
        if (!requireAuth) {

            return true

        }

        // 如果还未检查登录状态，先检查登录状态
        if (!userInfoStoreState.isCheckedLogin) {

            // 检查登录状态
            await checkLogin()

        }

        // 如果已登录，直接放行
        if (userInfoStoreState.isLogin) {

            return true

        }

        return {
            path: VITE_LOGIN_ROUTE,
            query: {
                ...to.query,
                redirectRoute: to.path
            }
        }

    })

}
