/*
 * @FileDesc: 响应拦截器模块
 */

import axios from "axios"

import { EApiResultCode } from "@/types"

import type { AxiosResponse } from "axios"

/**
 * FUN: 设置响应拦截器
 *
 * @author dyb-dev
 * @date 21/02/2025/  19:39:09
 */
export const setupResponseInterceptor = () => {

    axios.interceptors.response.use(
        // 2xx 范围内的状态码都会触发该函数
        response => response,
        // 超出 2xx 范围的状态码都会触发该函数
        error => {

            const errorResponse: AxiosResponse<IApiResult> = error.response ?? { data: {} }

            if (!Number.isSafeInteger(errorResponse.data.code)) {

                errorResponse.data = {
                    success: false,
                    code: errorResponse.status || EApiResultCode.INTERNAL_SERVER_ERROR,
                    message: errorResponse.statusText || "网络错误或无响应"
                } as IApiResult

            }

            return Promise.reject(errorResponse)

        }
    )

}
