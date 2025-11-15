/*
 * @FileDesc: Demo 对话框
 */

import { showDialog } from "@/components"

import Default from "./Default.vue"

import type { IDefaultProps } from "./Default.vue"
import type { IDialogResult, TShowDialogOptions } from "@/components"
import type { TExcludeDefault } from "@/utils"

/** 显示 `Demo 对话框` 选项 */
export interface IShowDemoDialogOptions extends TExcludeDefault<TShowDialogOptions<IShowDemoDialogResult>> {
    /** 默认插槽 Props */
    default: IDefaultProps
}

/** 显示 `Demo 对话框` 结果对象 */
export interface IShowDemoDialogResult extends IDialogResult {
    /** 数据 */
    data: string
}

/**
 * FUN: 显示 `Demo 对话框`
 *
 * @author dyb-dev
 * @date 2025-11-10 11:33:48
 * @param {IShowDemoDialogOptions} options 选项
 * @returns {*}  {Promise<IShowDemoDialogResult>} 结果对象
 */
export const showDemoDialog = (options: IShowDemoDialogOptions): Promise<IShowDemoDialogResult> => {

    const { default: defaultProps, ...dialogOptions } = options

    return showDialog<IShowDemoDialogResult>({
        ...dialogOptions,
        default: <Default {...defaultProps} />
    })

}
