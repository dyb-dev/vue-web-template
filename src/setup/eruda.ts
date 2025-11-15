/*
 * @FileDesc: 初始化 eruda 调试器
 */

import { isEnableDebug } from "@/utils"

/** LET: 是否初始化 */
let _isSetup = false

/**
 * FUN: 初始化 eruda 调试器
 *
 * @author dyb-dev
 * @date 2025-10-28 22:54:12
 */
export const setupEruda = () => {

    /** 已经完成初始化时 */
    if (_isSetup) {

        return

    }

    // 未启用调试时
    if (!isEnableDebug()) {

        return

    }

    import("eruda")
        .then(({ default: eruda }) => {

            eruda.init()
            window.eruda = eruda

            console.log("[项目信息]", __PROJECT_INFO__)

            _isSetup = true

        })
        .catch(error => {

            console.error("eruda 加载失败", error)

        })

}
