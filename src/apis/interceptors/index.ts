/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 19:58:19
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 19:58:30
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
const setupApiInterceptor = () => {

    setupResponseInterceptor()

}

export { setupApiInterceptor }
