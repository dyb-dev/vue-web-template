<!--
 * @FileDesc: 默认插槽
 -->

<script setup lang="tsx">
import { Button } from "vant"

import { usePopupContext } from "@/components"

import type { IShowDemoPopupResult } from "."

/** 默认插槽 Props */
export interface IDefaultProps {
    /** 标题 */
    title: string
}

const props = withDefaults(defineProps<IDefaultProps>(), {})

/** HOOKS: 使用弹出层上下文 */
const { loadStatus, close, result } = usePopupContext<IShowDemoPopupResult>()
</script>

<template>
    <div class="demo-popup__default">
        <div class="demo-popup__default__title">{{ props.title }}</div>

        <Button
            type="primary"
            size="small"
            round
            block
            text="取消"
            :loading="loadStatus === 'loading' && result.actionType === 'cancel'"
            @click="close({ actionType: 'cancel', data: '点击取消按钮' })"
        />

        <Button
            type="primary"
            size="small"
            round
            block
            text="确认"
            :loading="loadStatus === 'loading' && result.actionType === 'confirm'"
            @click="close({ actionType: 'confirm', data: '点击确认按钮' })"
        />
    </div>
</template>

<style lang="scss" scoped>
.demo-popup__default {
    display: flex;
    flex-direction: column;
    gap: 50px 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 500px;

    &__title {
        font-weight: bold;
        font-size: 50px;
    }
}
</style>
