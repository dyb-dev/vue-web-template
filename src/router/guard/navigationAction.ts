/*
 * @Author: dyb-dev
 * @Date: 2024-07-23 21:08:18
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 13:59:41
 * @FilePath: /vue-web-template/src/router/guard/navigationAction.ts
 * @Description: 路由导航动作守卫模块
 */

import type { Router } from "vue-router"

/** CONST: 定义一个状态来跟踪上一个路由的索引 */
let lastRouteIndex: number = 0

/**
 * FUN: 设置导航动作守卫
 *
 * @author dyb-dev
 * @date 31/07/2024/  17:30:35
 * @export
 * @param {Router} router - 路由
 */
const setupNavigationActionGuard = (router: Router): void => {

    router.afterEach(to => {

        // 目标索引
        const _toIndex = window.history.state?.position || 0
        // 来源索引
        const _fromIndex = lastRouteIndex

        to.meta.navigationAction = _toIndex < _fromIndex ? "back" : "jump"

        // 更新上一个路由的索引
        lastRouteIndex = _toIndex

    })

}

export { setupNavigationActionGuard }
