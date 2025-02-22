/*
 * @Author: dyb-dev
 * @Date: 2023-11-08 15:55:25
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-15 10:24:40
 * @FilePath: /vue-web-template/src/stores/componentCache.ts
 * @Description: 组件缓存状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import { store } from "."

/** 组件缓存操作类型枚举 */
enum EComponentCacheActionType {
    Add = "add",
    Delete = "delete"
}

/** Store 状态类型 */
interface IComponentCacheStoreState {
    /** 组件缓存列表 */
    list: string[]
}

const useComponentCacheStore = defineStore("ComponentCacheStore", () => {

    const componentCacheStoreState = reactive<IComponentCacheStoreState>({
        list: []
    })

    /**
     * FUN: 设置组件缓存
     *
     * @author dyb-dev
     * @date 14/10/2024/  14:47:43
     * @param {EComponentCacheActionType} action - 操作类型
     * @param {(string | string[])} value - 需要操作的组件缓存
     */
    const setComponentCache = (action: EComponentCacheActionType, value: string | string[]) => {

        if (typeof value === "string") {

            value = value.split(",")

        }

        if (!Array.isArray(value)) {

            console.error("setComponentCache() value 参数类型错误 value:", value)
            return

        }

        let _list = componentCacheStoreState.list

        switch (action) {

        case EComponentCacheActionType.Add:
            _list = [...new Set([..._list, ...value])]
            break
        case EComponentCacheActionType.Delete:
            _list = _list.filter(item => !value.includes(item))
            break

        default:
            console.error("setComponentCache() action 操作类型错误 action:", action)
            break

        }

        componentCacheStoreState.list = _list

    }

    /**
     * FUN: 添加指定组件缓存
     *
     * @author dyb-dev
     * @date 14/10/2024/  14:48:31
     * @param {(string | string[])} value - 需要添加的组件缓存
     */
    const addComponentCache = (value: string | string[]) => {

        setComponentCache(EComponentCacheActionType.Add, value)

    }

    /**
     * FUN: 删除指定组件缓存
     *
     * @author dyb-dev
     * @date 14/10/2024/  14:48:51
     * @param {(string | string[])} value - 需要删除的组件缓存
     */
    const deleteComponentCache = (value: string | string[]) => {

        setComponentCache(EComponentCacheActionType.Delete, value)

    }

    /**
     * FUN: 清空组件缓存
     *
     * @author dyb-dev
     * @date 14/10/2024/  14:49:02
     */
    const clearComponentCache = () => {

        componentCacheStoreState.list = []

    }

    return {
        componentCacheStoreState,
        addComponentCache,
        deleteComponentCache,
        clearComponentCache
    }

})

/**
 * FUN: 使用状态管理
 *  - 在没有Vue组件上下文的情况下使用
 *
 * @author dyb-dev
 * @date 15/09/2024/  23:53:35
 * @returns store实例
 */
const useComponentCacheStoreWithOut = () => {

    return useComponentCacheStore(store)

}

export { EComponentCacheActionType, useComponentCacheStore, useComponentCacheStoreWithOut }
