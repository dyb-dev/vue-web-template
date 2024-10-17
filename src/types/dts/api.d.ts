/*
 * @Author: dyb-dev
 * @Date: 2024-10-17 12:36:04
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-17 13:55:15
 * @FilePath: /web-mobile-template/src/types/dts/api.d.ts
 * @Description: api 类型声明补充文件
 */

import "axios"

declare module "axios" {
    /** 扩展 AxiosResponse 接口 */
    interface AxiosResponse {
        /** 请求是否成功 */
        success: boolean
        /** 结果描述信息 */
        message: string
    }
}
