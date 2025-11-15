/*
 * @FileDesc: 初始化接口配置
 */

import axios from "axios"

import { setGlobalTestRequestConfig, setupApiInterceptor } from "@/apis"
import { isDevEnv } from "@/utils"

/** LET: 是否初始化 */
let _isSetup = false

/**
 * FUN: 初始化接口配置
 *
 * @author dyb-dev
 * @date 2025-07-21 16:04:14
 */
export const setupApi = () => {

    /** 已经完成初始化时 */
    if (_isSetup) {

        return

    }

    _isSetup = true

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
