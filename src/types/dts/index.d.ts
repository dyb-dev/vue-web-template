/*
 * @FileDesc: 全局类型声明补充文件
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
