<!--
 @author dyb-dev
 @date 18/10/2024/ 22:10:03
 @lastAuthor dyb-dev
 @lastEditTime 18/10/2024/ 22:10:20
 @filePath /web-mobile-template/src/views/[...path].vue
 @description 404 页面
-->

<script setup lang="ts">
import { Empty, Button } from "vant"
</script>

<template>
    <section class="not-found-page">
        <Empty description="抱歉，您访问的页面不存在">
            <Button round type="primary" to="/" class="not-found-page__back-button">返回首页</Button>
        </Empty>
    </section>
</template>

<style lang="scss" scoped>
.not-found-page {
    &__back-button {
        width: 342px;
        height: 89px;
    }
}
</style>
