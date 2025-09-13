<!--
 * @Author: dyb-dev
 * @Date: 2025-09-11 03:16:49
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-09-13 18:35:14
 * @FilePath: /vue-web-template/src/views/home/index.vue
 * @Description: index 子路由
-->

<script setup lang="ts">
import { Button } from "vant"

import { router } from "@/router"

/** 定义页面路由信息 */
definePage({
    meta: {
        title: "index 子路由"
    }
})
</script>

<template>
    <section class="index">
        <div class="index__title">index 子路由</div>

        <Button
            type="primary"
            size="small"
            @click="
                () => {
                    router.push('/home/two')
                }
            "
        >前往 two 子路由</Button>
    </section>
</template>

<style lang="scss" scoped>
.index {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: 1px solid #04a3ff;

    &__title {
        margin-top: 100px;
        margin-bottom: 100px;
        color: var(--text-color);
        font-size: 44px;
        text-align: center;
    }
}
</style>
