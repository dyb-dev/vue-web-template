<!--
 * @Author: dyb-dev
 * @Date: 2025-11-10 16:09:47
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-11-11 01:55:51
 * @FilePath: /vue-web-template/src/components/dialog/Dialog/Dialog.vue
 * @Description: 对话框
-->

<script setup lang="tsx" generic="Result extends IBaseResult = IDialogResult">
import { useVModels } from "@vueuse/core"
import { omit } from "es-toolkit"
import { Dialog } from "vant"
import { ref } from "vue"

import { useAsyncTask } from "@/hooks"

import { provideDialogContext } from "./context"

import type {
    IBaseResult,
    IDefaultEmits,
    IDefaultExpose,
    IDefaultProps,
    IDefaultSlots,
    TDefaultActionType
} from "@/utils/component"
import type { DialogProps } from "vant"
import type { Component, Ref } from "vue"

/** 对话框 结果对象 */
export interface IDialogResult {
    /** 动作类型 */
    actionType: TDefaultActionType | "cancel" | "confirm"
}

/** 对话框 Props */
export interface IDialogProps<Result extends IBaseResult = IDialogResult>
    extends Omit<IDefaultProps<Result>, "default">,
        Partial<Omit<DialogProps, "show" | "beforeClose" | "title" | "message" | "allow-html" | "message-align" | "callback">> {
    /**
     * 默认插槽
     * - 支持字符串和组件
     */
    default?: Component | string
    /**
     * 默认插槽内容水平对齐方式
     * - default Props 传递字符串时有效
     *
     * @default 'center'
     */
    defaultAlign?: DialogProps["messageAlign"]
    /**
     * 是否允许支持默认插槽内容 HTML 渲染
     * - default Props 传递字符串时有效
     *
     * @default false
     */
    allowHtml?: boolean
    /** 标题插槽 */
    title?: Component
    /** 底部插槽 */
    footer?: Component
    /** 监听点击确认按钮时触发 */
    onConfirm?: () => void | Promise<void>
    /** 监听点击取消按钮时触发 */
    onCancel?: () => void | Promise<void>
}

/** 对话框 Emits */
export interface IDialogEmits<Result extends IBaseResult = IDialogResult> extends IDefaultEmits<Result> {
    /** 监听点击确认按钮时触发 */
    (event: "confirm"): void | Promise<void>
    /** 监听点击取消按钮时触发 */
    (event: "cancel"): void | Promise<void>
}

/** 对话框 Slots */
export interface IDialogSlots<
    Result extends IBaseResult = IDialogResult,
    Expose extends IDialogExpose<Result> = IDialogExpose<Result>
> extends IDefaultSlots<Result, Expose> {
    /** 标题插槽 */
    title(expose: Expose): Component
    /** 底部插槽 */
    footer(expose: Expose): Component
}

/** 对话框 Expose */
export interface IDialogExpose<Result extends IBaseResult = IDialogResult> extends IDefaultExpose<Result> {}

const props = withDefaults(defineProps<IDialogProps<Result>>(), {
    showConfirmButton: true,
    overlay: true,
    closeOnPopstate: true,
    lazyRender: true,
    lockScroll: true,
    keyboardEnabled: true,
    defaultAlign: "center",
    allowHtml: false
})

const emits = defineEmits<IDialogEmits<Result>>()

defineSlots<IDialogSlots<Result>>()

const { visible } = useVModels(props, emits)

/** REF: 结果对象 */
const result = ref({
    actionType: "close"
} as Result) as Ref<Result>

/** HOOKS: 使用异步任务执行器 */
const { loadStatus, run } = useAsyncTask()

/**
 * FUN: 关闭前的回调函数
 *
 * @param newResult 新的结果对象
 * @returns 是否允许关闭
 */
const beforeClose = async(newResult = { actionType: "close" } as Result): Promise<boolean> => {

    if (loadStatus.value === "loading") {

        console.warn("正在执行中,无法关闭")
        return false

    }

    result.value = newResult
    /** 是否关闭 */
    const isClose = !!await run(() => props.beforeClose?.(newResult) ?? true, "操作异常,无法关闭")

    return isClose

}

/**
 * FUN: 执行关闭操作
 *
 * @param newResult 新的结果对象
 */
const close = async(newResult?: Result): Promise<void> => {

    /** 是否关闭 */
    const isClose = await beforeClose(newResult)
    visible.value = !isClose

}

/** CONST: 暴露的对象 */
const expose: IDialogExpose<Result> = {
    loadStatus,
    result,
    close
}

/** FUN: 提供对话框上下文 */
provideDialogContext<Result>(expose)

defineExpose<IDialogExpose<Result>>(expose)
</script>

<template>
    <Dialog
        v-bind="
            omit(props, [
                'visible',
                'beforeClose',
                'onClose',
                'onClosed',
                'title',
                'default',
                'footer',
                'default',
                'defaultAlign'
            ])
        "
        :message="typeof props.default === 'string' ? props.default : ''"
        :message-align="props.defaultAlign"
        v-model:show="visible"
        :before-close="actionType => beforeClose(actionType && { actionType })"
        @close="
            () => {
                // eslint-disable-next-line vue/require-explicit-emits
                emits('close', result)
            }
        "
        @closed="
            () => {
                // eslint-disable-next-line vue/require-explicit-emits
                emits('closed', result)
            }
        "
    >
        <template #title v-if="props.title">
            <slot name="title" v-bind="expose">
                <component :is="props.title" />
            </slot>
        </template>

        <template #default v-if="typeof props.default !== 'string'">
            <slot name="default" v-bind="expose">
                <component :is="props.default" />
            </slot>
        </template>

        <template #footer v-if="props.footer">
            <slot name="footer" v-bind="expose">
                <component :is="props.footer" />
            </slot>
        </template>
    </Dialog>
</template>
