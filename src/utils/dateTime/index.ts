/*
 * @Author: dyb-dev
 * @Date: 2024-06-01 14:36:15
 * @LastEditors: v_zhgtzhong
 * @LastEditTime: 2025-08-01 00:10:44
 * @FilePath: /vue-web-template/src/utils/dateTime/index.ts
 * @Description: 日期时间相关工具函数
 */

/**
 * FUN: 延迟函数
 *
 * @author dyb-dev
 * @date 19/02/2025/  15:55:58
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {*}  {Promise<void>} - 返回一个 Promise 对象
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
