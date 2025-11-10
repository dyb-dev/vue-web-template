<!--
 * @Author: dyb-dev
 * @Date: 2025-09-11 03:07:22
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-09-13 18:43:02
 * @FilePath: /vue-web-template/src/views/home.vue
 * @Description: 首页
-->

<script setup lang="tsx">
import { useTitle } from "@vueuse/core"
import { Button, Icon } from "vant"
import { useRoute } from "vue-router"

import Cube from "@/components/Cube.vue"
import { router } from "@/router"
import { getCurrentUrlQuery } from "@/utils"

/** 定义页面路由信息 */
definePage({
    meta: {
        title: "首页"
    }
})

/** HOOKS: 获取当前路由实例 */
const { meta } = useRoute()
/** HOOKS: 设置页面 Title */
useTitle(meta.title)

console.log("首页入参", getCurrentUrlQuery())

function onClickJumpButton() {

    router.push({ path: "/test", query: { test: "test" } })

}
</script>

<template>
    <section class="home">
        <div class="home__logo-box">
            <a href="https://cn.vuejs.org/" target="_blank">
                <img class="home__logo-box__item home__logo-box__item-vue" src="../assets/image/logo/vue.svg" />
            </a>

            <Icon class="home__logo-box__item-like" name="like" />

            <a href="https://cn.vitejs.dev/" target="_blank">
                <img class="home__logo-box__item home__logo-box__item-vite" src="../assets/image/logo/vite.svg" />
            </a>
        </div>

        <Button
            class="home__button"
            type="primary"
            size="small"
            round
            block
            icon="fire-o"
            text="Hello World!"
            @click="onClickJumpButton"
        />

        <div class="home__router-view">
            <!-- 子路由视图 -->
            <RouterView />
        </div>
        <Cube />
    </section>
</template>

<style lang="scss" scoped>
.home {
    display: flow-root;
    width: 100%;
    height: 100%;
    overflow: auto;

    &__logo-box {
        display: flex;
        gap: 0 60px;
        align-items: center;
        justify-content: center;
        margin: 100px 0 100px;

        &__item {
            height: 150px;
            transition: filter 300ms;
            transition: all 0.5s;
            will-change: filter;

            &-vue:hover {
                transform: scale(1.1);
                filter: drop-shadow(0 0 2em #42b883aa);
            }

            &-vite:hover {
                transform: scale(1.1);
                filter: drop-shadow(0 0 2em #646cffaa);
            }

            &-like {
                font-size: 35px;
                @include text-gradient-effect-mixin();
            }
        }
    }

    &__button {
        width: fit-content;
        margin: 0 auto;
        @include text-gradient-effect-mixin();

        /* stylelint-disable-next-line order/order */
        &:deep(.van-icon) {
            @include text-gradient-effect-mixin();
        }
    }

    &__router-view {
        width: 86%;
        height: 66.667vw;
        margin: 0 auto;
        margin-top: 100px;
    }
}
</style>
