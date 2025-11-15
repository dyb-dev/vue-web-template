/*
 * @FileDesc: 使用监视用户图片长按保存
 */

import { isIos } from "@/utils"

/**
 * HOOKS: 使用监视用户图片长按保存
 *
 * @author dyb-dev
 * @date 16/10/2024/  17:45:50
 * @param {string} imgSelectorName - 图片选择器
 * @param {() => void} callback - 长按保存结束回调
 */
export const useMonitorImgPressSave = (imgSelectorName: string, callback: () => void) => {

    try {

        /** 类型判断 */
        if (typeof imgSelectorName !== "string") {

            throw 'imgSelectorName 需要传 "string" 类型'

        }
        /** 类型判断 */
        if (typeof callback !== "function") {

            throw 'callback 需要传 "function" 类型'

        }

        const _imgDom = <HTMLImageElement>document.querySelector(imgSelectorName) ?? null
        /** 如果未找到dom元素 */
        if (!_imgDom) {

            throw `没有找到 "${imgSelectorName}" 选择器的dom元素`

        }
        /** 如果不是图片元素 */
        if (!(_imgDom instanceof HTMLImageElement)) {

            throw '不是一个 "图片" 元素,只能接受图片'

        }

        let _touchstartCallback: () => void, _touchendCallback: () => void

        /** FUN: 删除触摸监听 */
        const _imgDomRemoveEventListener = () => {

            _imgDom.removeEventListener("touchstart", _touchstartCallback)
            _imgDom.removeEventListener("touchend", _touchendCallback)

        }

        /** FUN: 设置安卓触摸 */
        const _setAndroidTouchMonitorEvent = () => {

            // 长按定时器
            let _pressTimer: any

            _touchstartCallback = () => {

                console.log("安卓触摸开始")

                clearTimeout(_pressTimer)
                _pressTimer = setTimeout(() => {

                    clearTimeout(_pressTimer)
                    /** 执行监测代码 */
                    callback()
                    _imgDomRemoveEventListener()

                }, 800)

            }

            _touchendCallback = () => {

                console.log("安卓触摸结束")
                clearTimeout(_pressTimer)
                _imgDomRemoveEventListener()

            }

            // 添加长按保存事件监听器（触摸开始）
            _imgDom.addEventListener("touchstart", _touchstartCallback)
            // 添加长按保存事件监听器（触摸结束）
            _imgDom.addEventListener("touchend", _touchendCallback)

        }

        /** FUN: 设置IOS触摸 */
        const _setIosTouchMonitorEvent = () => {

            // 长按开始时间
            let _pressStartTime: any

            _touchstartCallback = () => {

                console.log("苹果触摸开始")

                // ios环境下H5长按保存图片会造成图片悬浮，可以取消默认事件去除这种效果，并不阻止下拉菜单的弹出（注意：微信环境下没有问题，其他APP环境下无法保存）
                // 踩坑：如果是企业微信环境下，需要注释这条代码，否则ios无法长按保存图片
                // isWx() && event.preventDefault()
                _pressStartTime = Date.now()

            }

            _touchendCallback = () => {

                console.log("苹果触摸结束")
                /** 长按时间大于800毫秒执行监测代码 */
                Date.now() - _pressStartTime > 800 && callback()
                _imgDomRemoveEventListener()

            }

            // 添加长按保存事件监听器（触摸开始）
            _imgDom.addEventListener("touchstart", _touchstartCallback)
            // 添加长按保存事件监听器（触摸结束）
            _imgDom.addEventListener("touchend", _touchendCallback)

        }

        /** 由于安卓跟苹果的差异，当用户长按图片保存菜单弹出时，安卓不会触发touchend事件，苹果会，所以这里分2套 */
        isIos() ? _setIosTouchMonitorEvent() : _setAndroidTouchMonitorEvent()

    }
    catch (error) {

        console.error("useMonitorImgPressSave()", error)

    }

}
