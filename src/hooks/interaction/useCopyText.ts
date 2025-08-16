/*
 * @Author: dyb-dev
 * @Date: 2025-08-16 13:42:32
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-08-16 13:44:02
 * @FilePath: /vue-web-template/src/hooks/interaction/useCopyText.ts
 * @Description: 使用复制文本
 */

import copy from "copy-to-clipboard"
import { showToast } from "vant"

/** 使用复制文本 选项 */
export interface IUseCopyTextOptions {
    /**
     * 复制成功提示消息
     *
     * @default ''
     */
    message?: string
    /**
     * 是否启用控制台输出
     *
     * @default false
     */
    debug?: boolean
    /**
     * 复制内容 MIME 类型
     *
     * @default 'text/html'
     */
    format?: string
    /** 监听复制成功回调 */
    onCopyText?: (params: any) => void
}

/** 使用复制文本 返回 */
export interface IUseCopyTextReturn {
    /** 复制文本 */
    copyText: (options: string | ICopyTextOptions) => boolean
}

/** 复制文本选项 */
export interface ICopyTextOptions extends IUseCopyTextOptions {
    /** 复制文本 */
    text: string
}

/**
 * HOOKS: 使用复制文本
 *
 * @author dyb-dev
 * @date 2025-08-11 18:50:47
 * @param {IUseCopyTextOptions} globalOptions 全局选项
 * @returns {*}  {IUseCopyTextReturn} 返回
 */
export const useCopyText = (globalOptions?: IUseCopyTextOptions): IUseCopyTextReturn => {

    /**
     * FUN: 复制文本
     *
     * @author dyb-dev
     * @date 2025-08-11 18:25:39
     * @param {string | ICopyTextOptions} options 选项
     * @returns {boolean} 是否复制成功
     */
    const copyText: IUseCopyTextReturn["copyText"] = options => {

        try {

            // 参数归一
            let _options: ICopyTextOptions =
                typeof options === "string"
                    ? {
                        text: options
                    }
                    : options

            // 合并全局选项
            _options = {
                ...globalOptions,
                ..._options
            }

            // 执行复制
            const _result = copy(_options.text, {
                debug: _options.debug,
                format: _options.format,
                onCopy: _options.onCopyText
            })

            // 复制失败
            if (!_result) {

                throw Error("复制失败")

            }

            // 成功提示
            _options.message &&
                showToast({
                    message: _options.message,
                    duration: 3000
                })

            return true

        }
        catch (error) {

            showToast({
                message: "复制失败",
                duration: 3000
            })

            return false

        }

    }

    return {
        copyText
    }

}
