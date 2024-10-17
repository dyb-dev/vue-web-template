/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 15:49:20
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 12:03:13
 * @FilePath: /web-mobile-template/src/stores/userInfo.ts
 * @Description: 用户信息状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import { loginApi } from "@/apis"

import type { ILoginApiParams } from "@/apis"

import { store } from "."

/** Store 状态类型 */
interface IUserInfoStoreState {
    /**
     * 是否登录成功
     */
    isLogin: boolean
    /**
     * 用户昵称
     */
    nickName: string
    /**
     * 用户手机号
     */
    phoneNumber: string
}

/** Store 实例 */
const useUserInfoStore = defineStore("UserInfoStore", () => {

    /** Store 状态 */
    const userInfoStoreState = reactive<IUserInfoStoreState>({
        isLogin: false,

        nickName: "",
        phoneNumber: ""
    })

    /**
     * FUN: 登录
     *
     * @author dyb-dev
     * @date 14/10/2024/  16:23:02
     * @param {ILoginApiParams} params 登录参数
     */

    /**
     * FUN: 登录
     *
     * @author dyb-dev
     * @date 17/10/2024/  12:03:44
     * @param {ILoginApiParams} params 登录参数
     * @returns {*} 登录结果
     */
    const login = async(params: ILoginApiParams) => {

        const _loginApiResult = await loginApi(params)

        // 如果登录失败
        if (_loginApiResult.success) {

            const {
                data: { nickName = "", phoneNumber = "" }
            } = _loginApiResult

            userInfoStoreState.nickName = nickName
            userInfoStoreState.phoneNumber = phoneNumber

            userInfoStoreState.isLogin = true

        }

        return _loginApiResult

    }

    return { userInfoStoreState, login }

})

/**
 * FUN: 使用状态管理
 *  - 在没有Vue组件上下文的情况下使用
 *
 * @author dyb-dev
 * @date 15/09/2024/  23:53:35
 * @returns store实例
 */
const useUserInfoStoreWithOut = () => {

    return useUserInfoStore(store)

}

export { useUserInfoStore, useUserInfoStoreWithOut }
