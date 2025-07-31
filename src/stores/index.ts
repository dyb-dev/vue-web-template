/*
 * @Author: dyb-dev
 * @Date: 2024-03-15 00:48:42
 * @LastEditors: v_zhgtzhong
 * @LastEditTime: 2025-08-01 00:09:25
 * @FilePath: /vue-web-template/src/stores/index.ts
 * @Description: store模块
 */

export * from "./activity"
export * from "./componentCache"
export * from "./theme"
export * from "./userInfo"

import { createPinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"

/** store 实例 */
export const store = createPinia()

// 使用全局持久化状态插件
store.use(
    createPersistedState({
        // 设置全局存储键名 默认: store名称
        key: storeKey => storeKey,
        // 设置全局存储方式 默认: localStorage
        storage: localStorage
    })
)
