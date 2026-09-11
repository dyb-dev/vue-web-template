/*
 * @FileDesc: Api 拦截器模块
 */

import { setupRequestInterceptor } from "./request"
import { setupResponseInterceptor } from "./response"

/**
 * FUN: 设置接口拦截器
 *
 * @author dyb-dev
 * @date 17/10/2024/  11:43:36
 */
export const setupApiInterceptor = () => {

    // 设置请求拦截器
    setupRequestInterceptor()
    // 设置响应拦截器
    setupResponseInterceptor()

}
