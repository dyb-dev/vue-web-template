/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 13:48:12
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 13:54:58
 * @FilePath: /web-mobile-template/src/types/dts/vue-router.d.ts
 * @Description: Vue Router 扩展接口
 */
import "vue-router"

declare module "vue-router" {
    interface RouteMeta {
        /** 路由导航动作 */
        navigationAction: "jump" | "back"
    }
}
