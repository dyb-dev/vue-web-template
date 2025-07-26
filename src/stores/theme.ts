/*
 * @Author: dyb-dev
 * @Date: 2024-10-13 21:32:31
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-07-26 13:16:55
 * @FilePath: /vue-web-template/src/stores/theme.ts
 * @Description: 主题状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import { store } from "."

/** 主题枚举 */
const enum ETheme {
    /** 浅色主题 */
    Light = "light",
    /** 深色主题 */
    Dark = "dark"
}

/** CONST: 深色主题类名 */
const THEME_DARK_CLASS_NAME = "theme-dark"

/** Store 状态类型 */
interface IThemeStoreState {
    theme: ETheme
}

/** Store 实例 */
const useThemeStore = defineStore("ThemeStore", () => {

    /** Store 状态 */
    const themeStoreState = reactive<IThemeStoreState>({
        theme: ETheme.Light
    })

    /**
     * FUN: 更新主题
     *
     * @param theme - 目标主题
     */
    const updateTheme = (theme: ETheme) => {

        // 文档根元素的类列表
        document.documentElement.classList.toggle(THEME_DARK_CLASS_NAME, theme === ETheme.Dark)

        themeStoreState.theme = theme

    }

    return { themeStoreState, updateTheme }

})

/**
 * FUN: 使用状态管理
 *  - 在没有Vue组件上下文的情况下使用
 *
 * @author dyb-dev
 * @date 15/09/2024/  23:53:35
 * @returns store实例
 */
const useThemeStoreWithOut = () => {

    return useThemeStore(store)

}

export { ETheme, useThemeStore, useThemeStoreWithOut }
