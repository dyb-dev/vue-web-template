/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 13:48:12
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-09-13 18:36:30
 * @FilePath: /vue-web-template/src/types/dts/vue-router.d.ts
 * @Description: Vue Router 扩展接口
 */

import "vue-router"

declare module "vue-router" {
    /** 路由元信息 */
    interface RouteMeta {
        /**
         * 路由标题
         * - 可用于侧边栏、面包屑等
         *
         * @default ""
         */
        title?: string
        /**
         * 是否需要登录
         *
         * @default false
         */
        requireAuth?: boolean
        /**
         * 路由导航动作
         * - "jump": 正常跳转（默认）
         * - "back": 返回上一级
         *
         * @default "jump"
         */
        navigationAction?: "jump" | "back"
    }
}
