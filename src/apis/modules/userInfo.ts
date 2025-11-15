/*
 * @FileDesc: 用户信息相关接口
 */

import { sendRequest } from "../request"

import type { AxiosResponse } from "axios"

/** 登录 参数 */
export interface ILoginApiParams {
    /** 用户手机号 */
    phoneNumber: string
    /** 用户密码 */
    password: string
}

/** 登录 结果数据 */
export interface ILoginApiResultData {
    /** 昵称 */
    nickName: string
    /** 绑定手机号 */
    phoneNumber: string
}

/**
 * FUN: 登录
 *
 * @author dyb-dev
 * @date 21/02/2025/  14:08:17
 * @param {ILoginApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig<ILoginApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<AxiosResponse<ILoginApiResultData>>} 结果数据
 */
export const loginApi = (
    params: ILoginApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig<ILoginApiResultData>, "test">
): Promise<AxiosResponse<ILoginApiResultData>> => {

    // TODO: 接口地址修改
    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}

/**
 * FUN: 检查登录状态
 *
 * @author dyb-dev
 * @date 21/02/2025/  14:08:51
 * @param {TModifyProperties<ITestRequestConfig, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<AxiosResponse>} 结果数据
 */
export const checkLoginApi = (testRequestConfig?: TModifyProperties<ITestRequestConfig, "test">): Promise<AxiosResponse> => {

    // TODO: 接口地址修改
    return sendRequest({
        url: "",
        testRequestConfig
    })

}

/**
 * FUN: 登出
 *
 * @author dyb-dev
 * @date 21/02/2025/  14:09:06
 * @param {TModifyProperties<ITestRequestConfig, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<AxiosResponse>} 结果数据
 */
export const logoutApi = (testRequestConfig?: TModifyProperties<ITestRequestConfig, "test">): Promise<AxiosResponse> => {

    // TODO: 接口地址修改
    return sendRequest({
        url: "/logout",
        testRequestConfig
    })

}
