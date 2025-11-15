/*
 * @FileDesc: 弹出层上下文
 */

import { inject, provide } from "vue"

import type { IPopupExpose } from "./Popup.vue"
import type { IBaseResult, IDefaultResult } from "@/utils/component"

/** CONST: 唯一标识 */
const KEY = Symbol("Popup")

/**
 * FUN: 提供弹出层上下文
 *
 * @author dyb-dev
 * @date 2025-11-10 12:19:19
 * @template Result 结果对象类型
 * @param {IPopupExpose<Result>} context 弹出层上下文
 */
export const providePopupContext = <Result extends IBaseResult = IDefaultResult>(context: IPopupExpose<Result>): void => {

    provide(KEY, context)

}

/**
 * HOOKS: 使用弹出层上下文
 *
 * @author dyb-dev
 * @date 2025-11-10 12:23:39
 * @template Result 结果对象类型
 * @returns {*}  {IPopupExpose<Result>} 弹出层上下文
 */
export const usePopupContext = <Result extends IBaseResult = IDefaultResult>(): IPopupExpose<Result> => {

    /** 弹出层上下文 */
    const context = inject(KEY) as IPopupExpose<Result>

    if (!context) {

        throw new Error("usePopupContext 必须在 Popup 组件内部使用")

    }

    return context

}
