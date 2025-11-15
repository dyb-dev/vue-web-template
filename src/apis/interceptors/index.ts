/*
 * @FileDesc: Api 拦截器模块
 */

import { setupResponseInterceptor } from "./response"

/**
 * FUN: 设置接口拦截器
 *
 * @author dyb-dev
 * @date 17/10/2024/  11:43:36
 */
export const setupApiInterceptor = () => {

    setupResponseInterceptor()

}
