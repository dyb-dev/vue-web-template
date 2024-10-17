/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 15:02:42
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 19:51:09
 * @FilePath: /web-mobile-template/src/stores/activity.ts
 * @Description: 活动状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import { store } from "."

/** Store 状态类型 */
interface IActivityStoreState {
    count: number
}

/** Store 实例 */
const useActivityStore = defineStore(
    "ActivityStore",
    () => {

        /** Store 状态 */
        const activityStoreState = reactive<IActivityStoreState>({
            count: 0
        })

        return { activityStoreState }

    }
    // {
    //     // 配置持久化状态,如果不需要可以删除掉 或 设置为false
    //     persist: {
    //         // 指定需要持久化的状态
    //         pick: ["activityStoreState.count"]
    //     }
    // }
)

/**
 * FUN: 使用状态管理
 *  - 在没有Vue组件上下文的情况下使用
 *
 * @author dyb-dev
 * @date 15/09/2024/  23:53:35
 * @returns store实例
 */
const useActivityStoreWithOut = () => {

    return useActivityStore(store)

}

export { useActivityStore, useActivityStoreWithOut }
