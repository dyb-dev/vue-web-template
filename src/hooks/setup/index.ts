/*
 * @Author: dyb-dev
 * @Date: 2025-07-26 13:17:29
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-07-26 13:17:47
 * @FilePath: /vue-web-template/src/hooks/setup/index.ts
 * @Description: 初始化相关hooks函数
 */

import axios from "axios"

import { setGlobalTestRequestConfig, setupApiInterceptor } from "@/apis"
import { ETheme, useThemeStore } from "@/stores"
import { isEnableDebug, isDevEnv } from "@/utils"

/**
 * HOOKS: 使用初始化 VConsole 调试器
 *
 * @author dyb-dev
 * @date 2025-07-21 16:01:36
 */
export const useSetupVConsole = () => {

    // 启用调试时
    if (isEnableDebug()) {

        import("vconsole")
            .then(({ default: VConsole }) => {

                window.vConsole = new VConsole()

                console.log("[项目信息]", __PROJECT_INFO__)

            })
            .catch(error => {

                console.error("VConsole 加载失败", error)

            })

    }

}

/**
 * HOOKS: 使用初始化接口配置
 *
 * @author dyb-dev
 * @date 2025-07-21 16:04:14
 */
export const useSetupApi = () => {

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

/**
 * HOOKS: 使用初始化主题
 *
 * @author dyb-dev
 * @date 2025-07-21 16:14:37
 */
export const useSetupTheme = () => {

    // 启用暗黑主题时
    if (__PROJECT_INFO__.env.VITE_DARK === "true") {

        /** HOOKS: 使用主题状态管理 */
        const { updateTheme } = useThemeStore()

        /**
         * FUN: 更新主题
         *
         * @param event 事件对象
         */
        const _updateTheme = (event: MediaQueryListEvent) => {

            updateTheme(event.matches ? ETheme.Dark : ETheme.Light)

        }

        /** 系统暗黑主题查询 */
        const _darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

        _updateTheme({ matches: _darkModeMediaQuery.matches } as MediaQueryListEvent)

        // 监听系统主题变化
        _darkModeMediaQuery.addEventListener("change", _updateTheme)

    }

}
