/*
 * @Author: dyb-dev
 * @Date: 2025-11-10 11:34:10
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-11-11 01:43:52
 * @FilePath: /vue-web-template/src/components/popup/DemoPopup/index.tsx
 * @Description: Demo 弹出层
 */

import { showPopup } from "@/components"

import Default from "./Default.vue"

import type { IDefaultProps } from "./Default.vue"
import type { TShowPopupOptions } from "@/components"
import type { TDefaultActionType, TExcludeDefault } from "@/utils"

/** 显示 `Demo 弹出层` 选项 */
export interface IShowDemoPopupOptions extends TExcludeDefault<TShowPopupOptions<IShowDemoPopupResult>> {
    /** 默认插槽 Props */
    default: IDefaultProps
}

/** 显示 `Demo 弹出层` 结果对象 */
export interface IShowDemoPopupResult {
    /** 动作类型 */
    actionType: TDefaultActionType | "cancel" | "confirm"
    /** 数据 */
    data: string
}

/**
 * FUN: 显示 `Demo 弹出层`
 *
 * @author dyb-dev
 * @date 2025-11-10 11:33:48
 * @param {IShowDemoPopupOptions} options 选项
 * @returns {*}  {Promise<IShowDemoPopupResult>} 结果对象
 */
export const showDemoPopup = (options: IShowDemoPopupOptions): Promise<IShowDemoPopupResult> => {

    const { default: defaultProps, ...popupOptions } = options

    return showPopup<IShowDemoPopupResult>({
        ...popupOptions,
        default: <Default {...defaultProps} />
    })

}
