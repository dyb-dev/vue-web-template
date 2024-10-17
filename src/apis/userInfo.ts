/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 16:00:39
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 12:22:34
 * @FilePath: /web-mobile-template/src/apis/userInfo.ts
 * @Description: 用户信息相关接口
 */

import axios from "axios"

import type { AxiosResponse } from "axios"

import { ENABLE_API_TEST_DATA } from "."

/** 登录的参数 */
interface ILoginApiParams {
    /** 用户手机号 */
    phoneNumber: string
    /** 用户密码 */
    password: string
}

/** 登录的结果数据 */
interface ILoginApiResultData {
    /** 昵称 */
    nickName: string
    /** 绑定手机号 */
    phoneNumber: string
}

/**
 * FUN: 登录
 *
 * @author dyb-dev
 * @date 09/10/2024/  16:33:23
 * @param {ILoginApiParams} params 参数
 * @returns {*} 登录的结果数据
 */
const loginApi = async(params: ILoginApiParams): Promise<AxiosResponse<ILoginApiResultData, ILoginApiParams>> => {

    try {

        // 测试数据
        if (ENABLE_API_TEST_DATA) {

            return {
                success: true,
                message: "请求成功",
                data: {
                    nickName: "xxx",
                    phoneNumber: "111111111"
                }
            } as AxiosResponse<ILoginApiResultData, ILoginApiParams>

        }

        // TODO: 接口地址修改
        const _result = await axios.post<ILoginApiResultData, AxiosResponse<ILoginApiResultData, ILoginApiParams>>("", params)

        return _result

    }
    catch (error) {

        return error as AxiosResponse<ILoginApiResultData, ILoginApiParams>

    }

}

export type { ILoginApiParams, ILoginApiResultData }

export { loginApi }
