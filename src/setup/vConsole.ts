/*
 * @Author: dyb-dev
 * @Date: 2025-07-28 13:03:04
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-07-28 13:21:04
 * @FilePath: /vue-web-template/src/setup/vconsole.ts
 * @Description: 初始化 VConsole 调试器
 */

import { isEnableDebug } from "@/utils"

/** LET: 是否初始化 */
let _isSetup = false

/**
 * FUN: 初始化 VConsole 调试器
 *
 * @author dyb-dev
 * @date 2025-07-21 16:01:36
 */
export const setupVConsole = () => {

    /** 已经完成初始化时 */
    if (_isSetup) {

        return

    }

    // 未启用调试时
    if (!isEnableDebug()) {

        return

    }

    import("vconsole")
        .then(({ default: VConsole }) => {

            window.vConsole = new VConsole()

            console.log("[项目信息]", __PROJECT_INFO__)

            _isSetup = true

        })
        .catch(error => {

            console.error("VConsole 加载失败", error)

        })

}
