/*
 * @FileDesc: 请求拦截器模块
 */

import axios from "axios"
import Cookies from "js-cookie"

/**
 * FUN: 设置请求拦截器
 *
 * @author dyb-dev
 * @date 2026-08-30 06:30:24
 */
export const setupRequestInterceptor = () => {

    axios.interceptors.request.use(
        config => {

            config.headers["x-csrf-token"] = Cookies.get("csrf-token")
            return config

        },
        error => Promise.reject(error)
    )

}
