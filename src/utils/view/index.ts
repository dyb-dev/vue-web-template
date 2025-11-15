/*
 * @FileDesc: 视图相关工具函数
 */

/**
 * FUN: 等待视图可见函数
 *
 * @author dyb-dev
 * @date 15/10/2024/  21:04:07
 * @param {number} [checkInterval=100] - 检查间隔时间 单位 ms
 * @returns {*}  {Promise<void>} - 返回一个 Promise，视图可见时会被 resolve
 */
export const waitUntilViewVisible = (checkInterval: number = 100): Promise<void> => {

    return new Promise<void>(resolve => {

        /** 监听页面可见的定时器 */
        let _visibilityCheckInterval: TIntervalId | void

        /** 停止定时器 */
        const _clearVisibilityCheckInterval = () => {

            if (_visibilityCheckInterval) {

                clearInterval(_visibilityCheckInterval)
                _visibilityCheckInterval = undefined

            }

        }

        // 检查页面是否可见函数
        const _checkVisibility = (): boolean => {

            if (document.visibilityState === "visible") {

                resolve()
                _clearVisibilityCheckInterval()
                return true

            }
            return false

        }

        /** 事件处理器 */
        const _onVisibilityChange = () => {

            document.removeEventListener("visibilitychange", _onVisibilityChange)

            if (!_checkVisibility()) {

                _visibilityCheckInterval = setInterval(_checkVisibility, checkInterval)

            }

        }

        _clearVisibilityCheckInterval()
        document.addEventListener("visibilitychange", _onVisibilityChange)

    })

}
