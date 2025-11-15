/*
 * @FileDesc: 使用滚动隔离
 */

import { isRef, onMounted, onUnmounted, nextTick } from "vue"

import type { Ref } from "vue"

/**
 * 可解析为 DOM 元素的数据源类型
 * - 选择器字符串 | Ref | 返回dom函数
 */
type TElement<T> = string | Ref<T> | (() => T)

/**
 * HOOKS: 使用滚动隔离
 *
 * @author dyb-dev
 * @date 21/06/2025/  14:20:34
 * @param {(TElement<HTMLElement | HTMLElement[]>)} target 目标元素 `[选择器字符串 | ref对象 | 返回dom函数]`
 * @param {TElement<HTMLElement>} [scope=() => document.documentElement] 作用域元素（注意：目标元素为 `选择器字符串` 才奏效） `[选择器字符串 | ref对象 | 返回dom函数]`
 */
export const useScrollIsolate = (
    target: TElement<HTMLElement | HTMLElement[]>,
    scope: TElement<HTMLElement> = () => document.documentElement
) => {

    /** LET: 当前绑定监听器的目标元素列表 */
    let _targetElementList: HTMLElement[] = []

    /** HOOKS: 挂载钩子 */
    onMounted(async() => {

        await nextTick()
        // 获取目标元素列表
        _targetElementList = _getTargetElementList()
        // 遍历绑定 `滚轮` 事件
        _targetElementList.forEach(_element => {

            _element.addEventListener("wheel", _onWheel, { passive: false })

        })

    })

    /** HOOKS: 卸载钩子 */
    onUnmounted(() => {

        _targetElementList.forEach(_element => {

            _element.removeEventListener("wheel", _onWheel)

        })

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
     * FUN: 监听滚轮事件
     *
     * @param {WheelEvent} event 滚轮事件
     */
    const _onWheel = (event: WheelEvent) => {

        const { target, currentTarget, deltaY } = event
        let _element = target as HTMLElement

        while (_element) {

            // 启用滚动时
            if (_isScrollEnabled(_element)) {

                // 无法在当前滚动方向上继续滚动时
                if (!_isScrollFurther(_element, deltaY)) {

                    event.preventDefault()

                }
                return

            }

            // 向上查找不到滚动元素且到达当前目标元素边界时
            if (_element === currentTarget) {

                event.preventDefault()
                return

            }

            _element = _element.parentElement as HTMLElement

        }

    }

    /**
     * FUN: 是否启用滚动
     *
     * @param {HTMLElement} element 目标元素
     * @returns {boolean} 是否启用滚动
     */
    const _isScrollEnabled = (element: HTMLElement): boolean =>
        /(auto|scroll)/.test(getComputedStyle(element).overflowY) && element.scrollHeight > element.clientHeight

    /**
     * FUN: 是否能够在当前滚动方向上继续滚动
     *
     * @param {HTMLElement} element 目标元素
     * @param {number} deltaY 滚动方向
     * @returns {boolean} 是否能够在当前滚动方向上继续滚动
     */
    const _isScrollFurther = (element: HTMLElement, deltaY: number): boolean => {

        /** 是否向下滚动 */
        const _isScrollingDown = deltaY > 0
        /** 是否向上滚动 */
        const _isScrollingUp = deltaY < 0

        const { scrollTop, scrollHeight, clientHeight } = element

        /** 是否已到顶部 */
        const _isAtTop = scrollTop === 0
        /** 是否已到底部 */
        const _isAtBottom = scrollTop + clientHeight >= scrollHeight - 1

        /** 是否还能向下滚动 */
        const _willScrollDown = _isScrollingDown && !_isAtBottom
        /** 是否还能向上滚动 */
        const _willScrollUp = _isScrollingUp && !_isAtTop

        return _willScrollDown || _willScrollUp

    }

}
