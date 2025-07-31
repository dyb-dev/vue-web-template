/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 19:58:19
 * @LastEditors: v_zhgtzhong
 * @LastEditTime: 2025-08-01 00:06:30
 * @FilePath: /vue-web-template/src/apis/interceptors/index.ts
 * @Description: Api 拦截器模块
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
