/*
 * @FileDesc: 对话框
 */

/** 导出 `对话框` */
export { default as Dialog } from "./Dialog.vue"
/** 导出 `对话框` 类型 */
export * from "./Dialog.vue"
/** 导出 `对话框` 上下文 */
export * from "./context"

import { mountComponent } from "@/utils"

import Dialog from "./Dialog.vue"

import type { IDialogProps } from "./Dialog.vue"
import type { IBaseResult, IDefaultResult, TExcludeVisible, TRequireDefault } from "@/utils"

/** 显示 `对话框` 选项 */
export type TShowDialogOptions<Result extends IBaseResult = IDefaultResult> = TExcludeVisible<
    TRequireDefault<IDialogProps<Result>>
>

/**
 * FUN: 显示 `对话框`
 *
 * @author dyb-dev
 * @date 2025-11-10 14:27:56
 * @template Result 结果对象类型
 * @param {TShowDialogOptions<Result>} options 选项
 * @returns {*}  {Promise<Result>} 结果对象
 */
export const showDialog = <Result extends IBaseResult = IDefaultResult>(options: TShowDialogOptions<Result>): Promise<Result> => {

    // @ts-ignore
    return mountComponent<Result, TShowDialogOptions<Result>>(Dialog, {
        ...options
    })

}
