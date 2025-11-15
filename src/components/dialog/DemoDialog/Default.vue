<!--
 * @FileDesc: 默认插槽
 -->

<script setup lang="tsx">
import { onMounted } from "vue"

import { useDialogContext } from "@/components"

import type { IShowDemoDialogResult } from "."

/** 默认插槽 Props */
export interface IDefaultProps {
    /** 内容 */
    content: string
}

const props = withDefaults(defineProps<IDefaultProps>(), {})

/** HOOKS: 使用对话框上下文 */
const { loadStatus, result } = useDialogContext<IShowDemoDialogResult>()

/** HOOKS: 挂载 */
onMounted(() => {

    result.value.data = "默认插槽挂载成功"

})
</script>

<template>
    <div class="demo-dialog__default">
        <div>内容: {{ props.content }}</div>
        <div>加载状态: {{ loadStatus }}</div>
        <div>结果对象: {{ result }}</div>
    </div>
</template>

<style lang="scss" scoped>
.demo-dialog__default {
    display: flex;
    flex-direction: column;
    gap: 50px 0;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 500px;
}
</style>
