/*
 * @Author: dyb-dev
 * @Date: 2024-10-14 15:32:55
 * @LastEditors: v_zhgtzhong
 * @LastEditTime: 2025-08-01 00:11:14
 * @FilePath: /vue-web-template/src/utils/form/index.ts
 * @Description: 表单相关工具函数
 */

/** 导出身份证相关工具函数 */
export * from "./identityCard"

/**
 * FUN: 是否为手机号
 *
 * @author dyb-dev
 * @date 14/10/2024/  15:34:16
 * @param {string} phone - 手机号
 * @returns {*}  {boolean} - 是否为手机号
 */
export const isPhoneNumber = (phone: string): boolean => /^1[3456789]\d{9}$/.test(phone)

/**
 * FUN: 是否为邮箱
 *
 * @author dyb-dev
 * @date 14/10/2024/  15:35:02
 * @param {string} email - 邮箱
 * @returns {*}  {boolean} - 是否为邮箱
 */
export const isEmail = (email: string): boolean => /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(email)
