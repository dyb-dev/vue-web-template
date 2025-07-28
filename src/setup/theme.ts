/*
 * @Author: dyb-dev
 * @Date: 2025-07-28 13:03:24
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-07-28 13:19:48
 * @FilePath: /vue-web-template/src/setup/theme.ts
 * @Description: 初始化主题
 */

import { ETheme, useThemeStore } from "@/stores"

/** LET: 是否初始化 */
let _isSetup = false

/**
 * FUN: 初始化主题
 *
 * @author dyb-dev
 * @date 2025-07-21 16:14:37
 */
export const setupTheme = () => {

    /** 已经完成初始化时 */
    if (_isSetup) {

        return

    }

    _isSetup = true

    // 未启用暗黑主题时
    if (__PROJECT_INFO__.env.VITE_DARK !== "true") {

        return

    }

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
