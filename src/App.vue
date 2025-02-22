<!--
 * @Author: dyb-dev
 * @Date: 2023-11-08 15:55:25
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-14 15:05:48
 * @FilePath: /vue-web-template/src/App.vue
 * @Description: App根组件
-->

<script setup lang="ts">
import { ConfigProvider } from "vant"
import { RouterView } from "vue-router"

import { useComponentCacheStore, useThemeStore } from "@/stores"

/** HOOKS: 使用主题商店 */
const { themeStoreState } = useThemeStore()

/** HOOKS: 使用组件激活商店 */
const { componentCacheStoreState } = useComponentCacheStore()

// EVENT: 监听页面过渡动画进入之前执行
const onBeforeEnter = () => {

    // 为了使页面导航过渡动画正常进行，需要手动滚动到顶部
    window.scrollTo(0, 0)

}
</script>

<template>
    <ConfigProvider class="config-provider" :theme="themeStoreState.theme">
        <RouterView v-slot="{ Component, route }">
            <Transition :name="route.meta.navigationAction" mode="out-in" @before-enter="onBeforeEnter">
                <KeepAlive :include="componentCacheStoreState.list">
                    <component :is="Component" />
                </KeepAlive>
            </Transition>
        </RouterView>
    </ConfigProvider>
</template>

<style lang="scss" scoped>
.config-provider {
    position: relative;
    height: 100vh;
}

.jump-enter-active,
.jump-leave-active,
.back-enter-active,
.back-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.5s ease;
}

.jump-enter,
.back-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

.jump-leave-to,
.back-enter {
    transform: translateX(-100%);
    opacity: 0;
}
</style>
