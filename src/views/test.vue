<!--
 * @Author: dyb-dev
 * @Date: 2024-10-14 00:04:44
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-09-13 18:33:28
 * @FilePath: /vue-web-template/src/views/test.vue
 * @Description: 测试页面
-->

<script setup lang="tsx">
import { useTitle } from "@vueuse/core"
import { Button, showToast } from "vant"
import { ref } from "vue"
import { useRoute } from "vue-router"

import { getIdApi, getUserInfoApi } from "@/apis"
import { router } from "@/router"

/** 定义页面路由信息 */
definePage({
    meta: {
        title: "测试",
        requireAuth: true
    }
})

/** HOOKS: 获取当前路由实例 */
const { query, meta } = useRoute()
/** HOOKS: 设置页面 Title */
useTitle(meta.title)

console.log("测试页面入参:", query)

/** EVENT: 点击页面返回 */
const onClickBack = () => {

    router.back()

}

/** REF: userId */
const userId = ref(0)

/** EVENT: 点击获取userId按钮 */
const onClickGetUserInfoButton = async() => {

    const _result = await getUserInfoApi({
        testResult: {
            success: true,
            message: "success",
            data: {
                body: "success",
                userId: 123,
                title: "success",
                id: 1
            }
        }
    })

    // 存在错误码或者不存在data数据
    if (!_result.success) {

        showToast(_result.message || "获取userId失败")
        return

    }
    userId.value = _result.data.userId

}

/** REF: id */
const id = ref(0)

/** EVENT: 点击获取id按钮 */
const onClickGetIdButton = async() => {

    const _result = await getIdApi(
        {
            userId: 123
        },
        {
            testResult: {
                success: true,
                message: "success",
                data: {
                    id: 1
                }
            }
        }
    )

    // 存在错误码或者不存在data数据
    if (!_result.success) {

        showToast(_result.message || "获取id失败")
        return

    }
    id.value = _result.data.id

}
</script>

<template>
    <section class="test">
        <div class="test__box">
            <Button
                type="primary"
                size="small"
                round
                icon="fire-o"
                text="获取userId"
                @click="onClickGetUserInfoButton"
            />

            <div>userId: {{ userId }}</div>
        </div>

        <div class="test__box">
            <Button
                type="primary"
                size="small"
                round
                icon="fire-o"
                text="获取id"
                @click="onClickGetIdButton"
            />

            <div>id: {{ id }}</div>
        </div>

        <Button
            style="width: 300px; margin: 0 auto"
            type="primary"
            round
            block
            icon="fire-o"
            text="返回"
            @click="onClickBack"
        />
    </section>
</template>

<style lang="scss" scoped>
.test {
    display: flow-root;
    width: 100%;
    height: 100%;
    padding-top: 200px;

    &__box {
        display: flex;
        gap: 0 60px;
        align-items: center;
        justify-content: center;
        margin-bottom: 80px;
        font-size: 28px;
    }
}
</style>
