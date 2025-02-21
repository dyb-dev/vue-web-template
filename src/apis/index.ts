/*
 * @Author: dyb-dev
 * @Date: 2024-03-16 14:53:14
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 20:00:55
 * @FilePath: /web-mobile-template/src/apis/index.ts
 * @Description: 接口模块
 */

/** 导出接口模块 */
export * from "./modules"

import axios from "axios"

import { isDevEnv } from "@/utils"

import { setupApiInterceptor } from "./interceptors"
import { setGlobalTestRequestConfig } from "./request"

/**
 * FUN: 设置接口配置
 *
 * @author dyb-dev
 * @date 08/10/2024/  20:47:43
 */
const setupApi = () => {

    // 设置请求基础路径
    axios.defaults.baseURL = __PROJECT_INFO__.env.VITE_API_BASE_PATH

    // 设置接口拦截器
    setupApiInterceptor()

    // 设置全局测试请求配置
    setGlobalTestRequestConfig({
        test: isDevEnv() && true,
        testDelay: 500
    })

}

export { setupApi }
