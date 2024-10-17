/*
 * @Author: dyb-dev
 * @Date: 2024-10-09 22:15:17
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-15 14:11:12
 * @FilePath: /web-mobile-template/src/utils/env/index.ts
 * @Description: 环境相关工具函数
 */

import { getCurrentUrlQueryValue } from "@/utils"

/**
 * FUN: 是否为开发环境
 *
 * @author dyb-dev
 * @date 09/10/2024/  17:34:47
 * @returns {*}  {boolean} 是否为开发环境
 */
const isDevEnv = (): boolean => import.meta.env.DEV

/**
 * FUN: 是否启用调试
 *
 * @author dyb-dev
 * @date 23/05/2023/  13:58:40
 * @returns {boolean} 是否开启debug
 */
const isEnableDebug = (): boolean => getCurrentUrlQueryValue("debug") === "1"

export { isDevEnv, isEnableDebug }
