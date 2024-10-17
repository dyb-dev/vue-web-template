/*
 * @Author: dyb-dev
 * @Date: 2024-07-23 17:27:15
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 14:00:52
 * @FilePath: /web-mobile-template/src/router/guard/index.ts
 * @Description: 路由守卫模块
 */

import { setupLoginGuard } from "./login"
import { setupNavigationActionGuard } from "./navigationAction"

import type { Router } from "vue-router"

/**
 * FUN: 设置路由守卫
 *
 * @author dyb-dev
 * @date 17/10/2024/  14:00:48
 * @param {Router} router - 路由实例
 */
const setupGuard = (router: Router) => {

    // 设置登录守卫
    setupLoginGuard(router)

    //  设置导航动作守卫
    setupNavigationActionGuard(router)

}

export { setupGuard }
