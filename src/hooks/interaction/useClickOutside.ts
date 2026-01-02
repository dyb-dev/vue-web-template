/*
 * @FileDesc: 使用监听目标元素外部的点击事件
 */

import { isRef, onMounted, onUnmounted, nextTick } from "vue"

import type { Ref } from "vue"

/**
 * 可解析为 DOM 元素的数据源类型
 * - 可以是选择器字符串、Ref、函数
 */
type TElement<T> = string | Ref<T> | (() => T)

/**
 * HOOKS: 使用监听目标元素外部的点击事件
 *
 * @author dyb-dev
 * @date 22/06/2025/  19:48:31
 * @param {(TElement<HTMLElement | HTMLElement[]>)} target 目标元素 `[选择器字符串 | ref对象 | 返回dom函数]`
 * @param {(() => void | Promise<void>)} callback 点击事件发生于目标元素外部时执行的回调函数
 * @param {TElement<HTMLElement>} [scope=() => document.documentElement] 作用域元素（注意：目标元素为 `选择器字符串` 才奏效） `[选择器字符串 | ref对象 | 返回dom函数]`
 */
export const useClickOutside = (
    target: TElement<HTMLElement | HTMLElement[]>,
    callback: () => void | Promise<void>,
    scope: TElement<HTMLElement> = () => document.documentElement
) => {

    /** LET: 目标元素列表 */
    let _targetElementList: HTMLElement[] = []

    /** HOOKS: 挂载钩子 */
    onMounted(async () => {

        await nextTick()
        // 获取目标元素列表
        _targetElementList = _getTargetElementList()
        _targetElementList.length > 0 && document.addEventListener("click", _onClickDocument)

    })

    /** HOOKS: 卸载钩子 */
    onUnmounted(() => {

        _targetElementList.length > 0 && document.removeEventListener("click", _onClickDocument)

    })

    /**
     * FUN: 获取目标元素列表
     * - 字符串时基于作用域选择器查找
     *
     * @returns {HTMLElement[]} 目标元素列表
     */
    const _getTargetElementList = (): HTMLElement[] => {

        let _getter: () => unknown

        if (typeof target === "string") {

            _getter = () => {

                const _scopeElement = _getScopeElement()
                return _scopeElement ? [..._scopeElement.querySelectorAll(target)] : []

            }

        }
        else {

            _getter = _createGetter(target)

        }

        const _result = _getter()
        const _normalized = Array.isArray(_result) ? _result : [_result]
        return _normalized.filter(_node => _node instanceof HTMLElement)

    }

    /**
     * FUN: 获取作用域元素（scope）
     * - 字符串时使用 querySelector
     *
     * @returns {HTMLElement | null} 作用域元素
     */
    const _getScopeElement = (): HTMLElement | null => {

        let _getter: () => unknown

        if (typeof scope === "string") {

            _getter = () => document.querySelector(scope)

        }
        else {

            _getter = _createGetter(scope)

        }

        const _result = _getter()
        return _result instanceof HTMLElement ? _result : null

    }

    /**
     * FUN: 创建公共 getter 函数
     * - 支持 Ref、函数、直接值
     *
     * @param {unknown} target 目标元素
     * @returns {(() => unknown)} 公共 getter 函数
     */
    const _createGetter = (target: unknown): (() => unknown) => {

        if (isRef(target)) {

            return () => (target as Ref<unknown>).value

        }
        if (typeof target === "function") {

            return target as () => unknown

        }
        return () => target

    }

    /**
     * FUN: 监听文档点击事件
     *
     * @param {MouseEvent} event 鼠标事件
     */
    const _onClickDocument = (event: MouseEvent) => {

        /** 是否点击事件发生于目标元素外部 */
        const _isOutside = !_targetElementList.some(element => element.contains(event.target as Node))
        _isOutside && callback()

    }

}
