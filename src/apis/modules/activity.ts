/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 17:08:19
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 20:00:59
 * @FilePath: /web-mobile-template/src/apis/modules/activity.ts
 * @Description: 本次活动接口模块
 */

import axios from "axios"

import { sendRequest } from "../request"

import type { AxiosResponse } from "axios"

/** 获取用户信息的结果数据 */
interface IGetUserInfoApiResultData {
    /** 内容 */
    body: string
    /** id */
    id: number
    /** 标题 */
    title: string
    /** 用户唯一标识 */
    userId: number
}

/**
 * FUN: 获取用户信息
 *
 * @author dyb-dev
 * @date 21/02/2025/  15:09:05
 * @param {TModifyProperties<ITestRequestConfig<IGetUserInfoApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<AxiosResponse<IGetUserInfoApiResultData>>} 结果数据
 */
const getUserInfoApi = async(
    testRequestConfig?: TModifyProperties<ITestRequestConfig<IGetUserInfoApiResultData>, "test">
): Promise<AxiosResponse<IGetUserInfoApiResultData>> => {

    return sendRequest({
        url: "/1",
        requestFn: axios.get,
        testRequestConfig
    })

}

/** 获取id的参数 */
interface IGetIdApiParams {
    /** 用户唯一标识 */
    userId: number
}

/** 获取id的结果数据 */
interface IGetIdApiResultData {
    /** id */
    id: number
}

/**
 * FUN: 获取id
 *
 * @author dyb-dev
 * @date 21/02/2025/  15:09:18
 * @param {IGetIdApiParams} params 参数
 * @param {TModifyProperties<ITestRequestConfig<IGetIdApiResultData>, "test">} [testRequestConfig] 测试请求配置
 * @returns {*}  {Promise<AxiosResponse<IGetIdApiResultData>>} 结果数据
 */
const getIdApi = async(
    params: IGetIdApiParams,
    testRequestConfig?: TModifyProperties<ITestRequestConfig<IGetIdApiResultData>, "test">
): Promise<AxiosResponse<IGetIdApiResultData>> => {

    return sendRequest({
        url: "",
        params,
        testRequestConfig
    })

}

export type { IGetUserInfoApiResultData, IGetIdApiParams, IGetIdApiResultData }

export { getUserInfoApi, getIdApi }
