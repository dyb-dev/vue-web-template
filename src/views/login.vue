<!--
 * @FileDesc: 登录页面
 -->

<script setup lang="tsx">
import { useTitle } from "@vueuse/core"
import { showDialog, showToast, Field, Button, showLoadingToast, closeToast } from "vant"
import { ref } from "vue"
import { useRoute } from "vue-router"

import { router } from "@/router"
import { useUserInfoStore } from "@/stores"
import { isDevEnv, isPhoneNumber } from "@/utils"

import type { RouteNamedMap } from "vue-router/auto-routes"

/** 定义页面路由信息 */
definePage({
    meta: {
        title: "登录"
    }
})

/** HOOKS: 获取当前路由实例 */
const { meta } = useRoute()
/** HOOKS: 设置页面 Title */
useTitle(meta.title)

/** 查询参数 */
interface ISearchParams {
    /** 重定向路由 默认: 首页路由 */
    redirectRoute?: keyof RouteNamedMap
    /** 其他相关参数 */
    [key: string]: any
}

/** HOOKS: 获取当前路由实例 */
const { query } = useRoute()
console.log("登录页面入参", query)

/** EVENT: 点击返回按钮 */
const onClickBackButton = () => {

    router.back()

}

/** REF: 手机号 */
const phoneNumber = ref("")
/** REF: 密码 */
const password = ref("")

/** HOOKS: 用户信息商店 */
const { login } = useUserInfoStore()

/** EVENT: 点击登录按钮 */
const onClickLoginButton = async() => {

    // 校验表单是否通过
    if (!isDevEnv() && !validateForm()) {

        return

    }

    showLoadingToast({ message: "正在登录...", mask: true, duration: 0 })

    // 登录
    const _loginApiResult = await login({
        phoneNumber: phoneNumber.value,
        password: password.value
    })

    closeToast()

    // 如果登录失败
    if (!_loginApiResult.success) {

        showDialog({
            title: "温馨提示",
            message: _loginApiResult.message || "登录失败, 请稍后重试"
        })

        return

    }

    const { redirectRoute = __PROJECT_INFO__.env.VITE_HOME_ROUTE, ...otherParams } = query as ISearchParams

    router.replace({ path: redirectRoute, query: otherParams })

}

// FUN: 验证表单数据
const validateForm = () => {

    if (!phoneNumber.value) {

        showToast("请输入手机号")
        return false

    }

    if (!isPhoneNumber(phoneNumber.value)) {

        showToast("请输入正确的手机号")
        return false

    }

    if (!password.value) {

        showToast("请输入密码")
        return false

    }

    return true

}
</script>

<template>
    <section class="login">
        <div class="login__form">
            <Field
                class="login__form__field"
                v-model="phoneNumber"
                label="手机号"
                type="tel"
                left-icon="user"
                placeholder="请输入手机号"
                maxlength="11"
                clearable
                autofocus
                label-width="45px"
                :border="false"
            />

            <Field
                class="login__form__field"
                v-model="password"
                label="密码"
                type="password"
                left-icon="bag-o"
                placeholder="请输入密码"
                clearable
                autofocus
                label-width="45px"
                :border="false"
            />

            <Button
                class="login__form__button"
                type="primary"
                size="large"
                round
                text="登录"
                @click="onClickLoginButton"
            />

            <Button
                class="login__form__button"
                type="primary"
                size="large"
                round
                text="返回"
                @click="onClickBackButton"
            />
        </div>
    </section>
</template>

<style lang="scss" scoped>
.login {
    display: flow-root;
    width: 100%;
    height: 100%;

    &__form {
        width: 650px;
        margin: 200px auto 0;
        padding: 60px 40px;
        background: var(--background-2);
        border: 1px solid var(--border-color);
        border-radius: 20px;

        &__field {
            margin-bottom: 30px;
            padding: var(--van-cell-vertical-padding) 0;
            border-bottom: 0.267vw solid var(--van-cell-border-color);

            &:last-of-type {
                margin-bottom: 0;
            }

            &:deep(.van-field__left-icon),
            &:deep(.van-field__label) {
                color: var(--primary-color);
            }
        }

        &__button {
            height: 75px;
            margin-top: 80px;
            font-size: 28px;

            &:last-child {
                margin-top: 30px;
            }
        }
    }
}
</style>
