/*
 * @FileDesc: 用户信息状态管理
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
export const useUserInfoStore = defineStore("UserInfoStore", () => {

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
     * @returns {*}  {Promise<AxiosResponse<ILoginApiResultData>>}
     */
    const login = async(params: ILoginApiParams): Promise<AxiosResponse<ILoginApiResultData>> => {

        const _loginApiResult = await loginApi(params, {
            testResult: {
                success: true,
                message: "登录成功",
                data: {
                    nickName: "123456",
                    phoneNumber: "13800138000"
                }
            }
        })

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
     * @returns {*}  {Promise<boolean>}
     */
    const checkLogin = async(): Promise<boolean> => {

        if (userInfoStoreState.isLogin) {

            return true

        }

        const _checkLoginApiResult = await checkLoginApi({
            testResult: {
                success: true,
                message: "检查登录成功"
            }
        })

        userInfoStoreState.isLogin = _checkLoginApiResult.success
        userInfoStoreState.isCheckedLogin = true

        return _checkLoginApiResult.success

    }

    /**
     * FUN: 退出登录
     *
     * @author dyb-dev
     * @date 19/02/2025/  20:38:20
     * @returns {*}  {Promise<AxiosResponse>}
     */
    const logout = async(): Promise<AxiosResponse> => {

        const _logoutApiResult = await logoutApi({
            testResult: {
                success: true,
                message: "退出登录成功"
            }
        })

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
export const useUserInfoStoreWithOut = () => {

    return useUserInfoStore(store)

}
