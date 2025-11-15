<!--
 * @FileDesc: two 子路由
 -->

<script setup lang="tsx">
import { Button } from "vant"

import { router } from "@/router"

/** 定义页面路由信息 */
definePage({
    meta: {
        title: "two 子路由"
    }
})
</script>

<template>
    <section class="two">
        <div class="two__title">two 子路由</div>

        <Button
            type="primary"
            size="small"
            @click="
                () => {
                    router.back()
                }
            "
        >返回 index 子路由</Button>
    </section>
</template>

<style lang="scss" scoped>
.two {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid #03e049;

    &__title {
        margin-top: 100px;
        margin-bottom: 100px;
        color: var(--text-color);
        font-size: 44px;
        text-align: center;
    }
}
</style>
