/*
 * @FileDesc: 对话框上下文
 */

import { inject, provide } from "vue"

import type { IDialogExpose } from "./Dialog.vue"
import type { IBaseResult, IDefaultResult } from "@/utils/component"

/** CONST: 唯一标识 */
const KEY = Symbol("Dialog")

/**
 * FUN: 提供对话框上下文
 *
 * @author dyb-dev
 * @date 2025-11-10 12:19:19
 * @template Result 结果对象类型
 * @param {IDialogExpose<Result>} context 对话框上下文
 */
export const provideDialogContext = <Result extends IBaseResult = IDefaultResult>(context: IDialogExpose<Result>): void => {

    provide(KEY, context)

}

/**
 * HOOKS: 使用对话框上下文
 *
 * @author dyb-dev
 * @date 2025-11-10 12:23:39
 * @template Result 结果对象类型
 * @returns {*}  {IDialogExpose<Result>} 对话框上下文
 */
export const useDialogContext = <Result extends IBaseResult = IDefaultResult>(): IDialogExpose<Result> => {

    /** 对话框上下文 */
    const context = inject(KEY) as IDialogExpose<Result>

    if (!context) {

        throw new Error("useDialogContext 必须在 Dialog 组件内部使用")

    }

    return context

}
