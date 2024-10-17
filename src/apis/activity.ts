/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 17:08:19
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 12:21:17
 * @FilePath: /web-mobile-template/src/apis/activity.ts
 * @Description: 本次活动接口模块
 */

import axios from "axios"

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
 * @date 08/10/2024/  21:42:12
 * @returns {*}  {Promise<AxiosResponse<IGetUserIdData, UnData>>} 用户信息
 */
const getUserInfoApi = async(): Promise<AxiosResponse<IGetUserInfoApiResultData>> => {

    try {

        const _result = await axios.get<IGetUserInfoApiResultData, AxiosResponse<IGetUserInfoApiResultData>>("/1")
        return _result

    }
    catch (error) {

        return error as AxiosResponse<IGetUserInfoApiResultData>

    }

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
 * @date 08/10/2024/  21:47:44
 * @param {IGetIdApiParams} params 参数
 * @returns {*}  {Promise<AxiosResponse<IGetIdApiResultData, IGetIdApiParams>>} 获取id的结果数据
 */
const getIdApi = async(params: IGetIdApiParams): Promise<AxiosResponse<IGetIdApiResultData, IGetIdApiParams>> => {

    try {

        const _result = await axios.post<IGetIdApiResultData, AxiosResponse<IGetIdApiResultData, IGetIdApiParams>>("", params)
        return _result

    }
    catch (error) {

        return error as AxiosResponse<IGetIdApiResultData, IGetIdApiParams>

    }

}

export type { IGetUserInfoApiResultData, IGetIdApiParams, IGetIdApiResultData }

export { getUserInfoApi, getIdApi }
