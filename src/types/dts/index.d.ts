/*
 * @author: dyb_dev
 * @date: 25/01/2024/ 16:01:37
 * @lastAuthor: dyb_dev
 * @lastEditTime: 17/03/2024/ 18:03:45
 * @filePath: /src/types/d.ts/index.d.ts
 * @description: 全局类型声明补充文件
 */

import type { Eruda } from "eruda"

declare global {
    /** 扩展 Window 接口 */
    interface Window {
        MSStream?: any
        /** eruda 实例 */
        eruda: Eruda
    }
}
