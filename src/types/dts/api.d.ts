/*
 * @FileDesc: api 类型声明补充文件
 */

import type { AxiosResponse } from "axios"

declare module "axios" {
    /** 扩展 AxiosResponse 接口 */
    interface AxiosResponse {
        /** 请求是否成功 */
        success: boolean
        /** 结果描述信息 */
        message: string
    }
}

declare global {
    /** 测试请求配置 */
    interface ITestRequestConfig<T extends Record<string, any> = Record<string, any>> {
        /** 是否启用测试模式 */
        test: boolean
        /** 测试模式下请求延迟时间 单位: 毫秒 */
        testDelay?: number
        /** 测试模式下请求结果 */
        testResult: TModifyProperties<Pick<AxiosResponse<T>, "success" | "message" | "data">, "data">
    }
}
