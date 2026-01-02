/*
 * @FileDesc: 组件相关工具函数
 */

import { createApp, defineComponent, onMounted, ref } from "vue"

import type { TLoadStatus } from "@/hooks"
import type { Component, Ref } from "vue"

/**
 * 基础结果对象
 * - 可用于自定义结果对象继承
 */
export interface IBaseResult<ActionType extends string = string> {
    /** 动作类型 */
    actionType: ActionType
}

/** 默认操作类型 */
export type TDefaultActionType = "close"

/** 默认结果对象 */
export interface IDefaultResult extends IBaseResult<TDefaultActionType> {}

/** 默认 Props */
export interface IDefaultProps<Result extends IBaseResult = IDefaultResult> {
    /** 是否显示 */
    visible: boolean
    /** 默认插槽 */
    default?: Component
    /**
     * 关闭前的回调函数
     * - 返回 true 允许关闭
     * - 返回 false 阻止关闭
     *
     * @param result 结果对象
     */
    beforeClose?: (result: Result) => boolean | Promise<boolean>
    /** 监听打开时立即触发 */
    onOpen?: () => void | Promise<void>
    /** 监听打开且动画结束后触发 */
    onOpened?: () => void | Promise<void>
    /**
     * 监听关闭时立即触发
     *
     * @param result 结果对象
     */
    onClose?: (result: Result) => void | Promise<void>
    /**
     * 监听关闭且动画结束后触发
     *
     * @param result 结果对象
     */
    onClosed?: (result: Result) => void | Promise<void>
}

/** 默认 Emits */
export interface IDefaultEmits<Result extends IBaseResult = IDefaultResult> {
    /**
     * 监听 visible 更新
     *
     * @param visible 是否显示
     */
    (event: "update:visible", visible: boolean): void
    /** 监听打开时立即触发 */
    (event: "open"): void | Promise<void>
    /** 监听打开且动画结束后触发 */
    (event: "opened"): void | Promise<void>
    /**
     * 监听关闭时立即触发
     *
     * @param result 结果对象
     */
    (event: "close", result: Result): void | Promise<void>
    /**
     * 监听关闭且动画结束后触发
     *
     * @param result 结果对象
     */
    (event: "closed", result: Result): void | Promise<void>
}

/** 默认 Slots */
export interface IDefaultSlots<
    Result extends IBaseResult = IDefaultResult,
    Expose extends IDefaultExpose<Result> = IDefaultExpose<Result>
> {
    /** 默认插槽 */
    default(expose: Expose): Component
}

/** 默认 Expose */
export interface IDefaultExpose<Result extends IBaseResult = IDefaultResult> {
    /** 加载状态 */
    loadStatus: Ref<TLoadStatus>
    /** 结果对象 */
    result: Ref<Result>
    /**
     * 执行关闭操作
     *
     * @param newResult 新的结果对象
     */
    close: (newResult?: Result) => Promise<void>
}

/**
 * 排除 visible 属性
 *
 * @template Props 传入的 Props
 */
export type TExcludeVisible<Props extends Record<string, any>> = Omit<Props, "visible">

/**
 * 排除 default 属性
 * - 可用于需要排除默认插槽相关属性的场景
 *
 * @template Props 传入的 Props
 */
export type TExcludeDefault<Props extends Record<string, any>> = Omit<Props, "default">

/**
 * 将 default 属性设为必选
 *
 * @template Props 传入的 Props
 */
export type TRequireDefault<Props extends Record<string, any>> = TModifyProperties<Props, "default", "required">

/**
 * FUN: 挂载组件
 *
 * @author dyb-dev
 * @date 2025-11-09 19:56:25
 * @template Result 结果对象类型
 * @template Props 组件 Props 类型
 * @param {*} component 组件
 * @param {Props} [props] 组件 Props
 * @returns {*}  {Promise<Result>} 结果对象
 */
export const mountComponent = <
    Result extends IBaseResult = IDefaultResult,
    Props extends TExcludeVisible<TRequireDefault<IDefaultProps<Result>>> = TExcludeVisible<
        TRequireDefault<IDefaultProps<Result>>
    >
>(
        component: any,
        props?: Props
    ): Promise<Result> => {

    return new Promise(resolve => {

        const mountNode = document.createElement("div")
        const rootNode = document.body
        rootNode.appendChild(mountNode)

        const Wrapper = defineComponent({
            name: "Wrapper",
            setup () {

                /** REF: 是否显示 */
                const visible = ref(false)

                /** HOOKS: 组件挂载完毕，确保 CSS 动画的初始状态能被正确应用 */
                onMounted(() => {

                    visible.value = true

                })

                const { onClosed, ...restProps } = props ?? {}

                return () =>
                    <component
                        {...restProps}
                        is={component}
                        v-model:visible={visible.value}
                        onClosed={(result: Result) => {

                            app.unmount()
                            rootNode.removeChild(mountNode)
                            onClosed?.(result)
                            resolve(result)

                        }}
                    />


            }
        })

        const app = createApp(Wrapper)
        app.mount(mountNode)

    })

}
