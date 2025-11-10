/*
 * @Author: dyb-dev
 * @Date: 2025-11-10 14:30:11
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-11-11 01:44:05
 * @FilePath: /vue-web-template/src/components/popup/Popup/index.ts
 * @Description: 弹出层
 */

/** 导出 `弹出层` */
export { default as Popup } from "./Popup.vue"
/** 导出 `弹出层` 类型 */
export * from "./Popup.vue"
/** 导出 `弹出层` 上下文 */
export * from "./context"

import { mountComponent } from "@/utils"

import Popup from "./Popup.vue"

import type { IPopupProps } from "./Popup.vue"
import type { IBaseResult, IDefaultResult, TExcludeVisible, TRequireDefault } from "@/utils"

/** 显示 `弹出层` 选项 */
export type TShowPopupOptions<Result extends IBaseResult = IDefaultResult> = TExcludeVisible<TRequireDefault<IPopupProps<Result>>>

/**
 * FUN: 显示 `弹出层`
 *
 * @author dyb-dev
 * @date 2025-11-10 01:32:55
 * @template Result 结果对象类型
 * @param {TShowPopupOptions<Result>} options 选项
 * @returns {*}  {Promise<Result>} 结果对象
 */
export const showPopup = <Result extends IBaseResult = IDefaultResult>(options: TShowPopupOptions<Result>): Promise<Result> => {

    return mountComponent<Result, TShowPopupOptions<Result>>(Popup, {
        ...options
    })

}
