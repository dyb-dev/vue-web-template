/*
 * @Author: dyb-dev
 * @Date: 2024-04-21 17:53:06
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-15 14:56:54
 * @FilePath: /web-mobile-template/src/utils/device/index.ts
 * @Description: 设备相关工具函数
 */

/**
 * FUN: 是否是微信环境
 *
 * @author dyb-dev
 * @date 15/10/2024/  14:20:35
 * @return {*}  {boolean} 是否是微信环境
 */
const isWx = (): boolean => /micromessenger/.test(navigator.userAgent.toLowerCase())

/**
 * FUN: 判断是否是IOS设备
 *
 * @author dyb-dev
 * @date 15/10/2024/  14:20:51
 * @return {*}  {boolean} 是否是IOS设备
 */
const isIos = (): boolean => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

/**
 * FUN: 判断是否是Android设备
 *
 * @author dyb-dev
 * @date 15/10/2024/  14:22:30
 * @return {*}  {boolean} 是否是Android设备
 */
const isAndroid = (): boolean => /Android/.test(navigator.userAgent)

export { isWx, isIos, isAndroid }
