/*
 * @FileDesc: 响应拦截器模块
 */

import axios from "axios"

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
        response => {

            response.success = true
            response.message = response.statusText || "请求成功"
            return response

        },
        // 超出 2xx 范围的状态码都会触发该函数
        error => {

            // 响应信息
            const _response = error.response as AxiosResponse

            // 处理有响应的情况
            if (_response) {

                _response.success = false
                _response.message = _response.statusText || "请求失败"

            }
            // 处理没有响应的情况（如网络错误）
            else {

                error.success = false
                error.message = "网络错误或无响应"

            }

            return Promise.reject(_response || error)

        }
    )

}
