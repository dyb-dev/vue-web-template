/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 15:49:20
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 17:37:26
 * @FilePath: /web-mobile-template/src/stores/userInfo.ts
 * @Description: 用户信息状态管理
 */

import { defineStore } from "pinia"
import { reactive } from "vue"

import { checkLoginApi, loginApi, logoutApi } from "@/apis"

import type { ILoginApiParams, ILoginApiResultData } from "@/apis"
import type { AxiosResponse } from "axios"

import { store } from "."

/** Store 状态类型 */
interface IUserInfoStoreState {
    /**
     * 是否登录成功
     */
    isLogin: boolean
    /**
     * 是否已检查登录状态
     * - 防止多次检查登录状态
     */
    isCheckedLogin: boolean
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
        isCheckedLogin: false,
        nickName: "",
        phoneNumber: ""
    })

    /**
     * FUN: 登录
     *
     * @author dyb-dev
     * @date 19/02/2025/  20:38:42
     * @param {ILoginApiParams} params 登录参数
     * @param {TRequestConfig<ILoginApiResultData>} [testRequestConfig] 测试请求配置
     * @returns {*}  {Promise<AxiosResponse<ILoginApiResultData>>}
     */
    const login = async(
        params: ILoginApiParams,
        testRequestConfig?: TModifyProperties<ITestRequestConfig<ILoginApiResultData>, "test">
    ): Promise<AxiosResponse<ILoginApiResultData>> => {

        const _loginApiResult = await loginApi(params, testRequestConfig)

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

    /**
     * FUN: 检查登录状态
     *
     * @author dyb-dev
     * @date 19/02/2025/  20:36:39
     * @param {TRequestConfig} [testRequestConfig] 测试请求配置
     * @returns {*}  {Promise<boolean>}
     */
    const checkLogin = async(testRequestConfig?: TModifyProperties<ITestRequestConfig, "test">): Promise<boolean> => {

        if (userInfoStoreState.isLogin) {

            return true

        }

        const _checkLoginApiResult = await checkLoginApi(testRequestConfig)

        userInfoStoreState.isLogin = _checkLoginApiResult.success
        userInfoStoreState.isCheckedLogin = true

        return _checkLoginApiResult.success

    }

    /**
     * FUN: 退出登录
     *
     * @author dyb-dev
     * @date 19/02/2025/  20:38:20
     * @param {TRequestConfig} [testRequestConfig] 测试请求配置
     * @returns {*}  {Promise<AxiosResponse>}
     */
    const logout = async(testRequestConfig?: TModifyProperties<ITestRequestConfig, "test">): Promise<AxiosResponse> => {

        const _logoutApiResult = await logoutApi(testRequestConfig)

        if (_logoutApiResult.success) {

            userInfoStoreState.isLogin = false

        }

        return _logoutApiResult

    }

    return { userInfoStoreState, login, checkLogin, logout }

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
