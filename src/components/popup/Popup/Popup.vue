<!--
 * @FileDesc: 弹出层
 -->

<script setup lang="tsx" generic="Result extends IBaseResult = IDefaultResult">
import { useVModels } from "@vueuse/core"
import { omit } from "es-toolkit"
import { Popup } from "vant"
import { ref } from "vue"

import { useAsyncTask } from "@/hooks"

import { providePopupContext } from "./context"

import type { IBaseResult, IDefaultEmits, IDefaultExpose, IDefaultProps, IDefaultResult, IDefaultSlots } from "@/utils/component"
import type { PopupProps } from "vant"
import type { Component, Ref } from "vue"

/** 弹出层 Props */
export interface IPopupProps<Result extends IBaseResult = IDefaultResult>
    extends IDefaultProps<Result>,
        Partial<Omit<PopupProps, "show" | "beforeClose">> {
    /** 遮罩层插槽 */
    overlayContent?: Component
    /**
     * 监听点击弹出层时触发
     *
     * @param e 鼠标事件
     */
    onClick?: (e: MouseEvent) => void | Promise<void>
    /**
     * 监听点击遮罩层时触发
     *
     * @param e 鼠标事件
     */
    onClickOverlay?: (e: MouseEvent) => void | Promise<void>
    /**
     * 监听点击关闭图标时触发
     *
     * @param e 鼠标事件
     */
    onClickCloseIcon?: (e: MouseEvent) => void | Promise<void>
}

/** 弹出层 Emits */
export interface IPopupEmits<Result extends IBaseResult = IDefaultResult> extends IDefaultEmits<Result> {
    /**
     * 监听点击弹出层时触发
     *
     * @param e 鼠标事件
     */
    (event: "click", e: MouseEvent): void | Promise<void>
    /**
     * 监听点击遮罩层时触发
     *
     * @param e 鼠标事件
     */
    (event: "click-overlay", e: MouseEvent): void | Promise<void>
    /**
     * 监听点击关闭图标时触发
     *
     * @param e 鼠标事件
     */
    (event: "click-close-icon", e: MouseEvent): void | Promise<void>
}

/** 弹出层 Slots */
export interface IPopupSlots<
    Result extends IBaseResult = IDefaultResult,
    Expose extends IPopupExpose<Result> = IPopupExpose<Result>
> extends IDefaultSlots<Result, Expose> {
    /** 遮罩层插槽 */
    overlayContent(expose: Expose): Component
}

/** 弹出层 Expose */
export interface IPopupExpose<Result extends IBaseResult = IDefaultResult> extends IDefaultExpose<Result> {}

const props = withDefaults(defineProps<IPopupProps<Result>>(), {
    overlay: true,
    closeOnClickOverlay: true,
    lockScroll: true,
    lazyRender: true
})

const emits = defineEmits<IPopupEmits<Result>>()

defineSlots<IPopupSlots<Result>>()

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

        console.warn("正在执行中，无法关闭")
        return false

    }

    result.value = newResult
    /** 是否关闭 */
    const isClose = !!await run(() => props.beforeClose?.(newResult) ?? true, "操作异常，无法关闭")

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
const expose: IPopupExpose<Result> = {
    loadStatus,
    result,
    close
}

/** FUN: 提供弹出层上下文 */
providePopupContext<Result>(expose)

defineExpose<IPopupExpose<Result>>(expose)
</script>

<template>
    <Popup
        v-bind="omit(props, ['visible', 'beforeClose', 'onClose', 'onClosed', 'default', 'overlayContent'])"
        v-model:show="visible"
        :before-close="() => beforeClose()"
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
        <template #default>
            <slot name="default" v-bind="expose">
                <component :is="props.default" />
            </slot>
        </template>

        <template #overlay-content>
            <slot name="overlayContent" v-bind="expose">
                <component :is="props.overlayContent" />
            </slot>
        </template>
    </Popup>
</template>
