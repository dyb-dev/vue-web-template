/*
 * @FileDesc: unocss 配置
 */

import { defineConfig, presetWind4 } from "unocss"
import { presetScrollbar } from "unocss-preset-scrollbar"

export default defineConfig({
    // 内容
    content: {
        // 管道
        pipeline: {
            // 包含文件
            include: [
                // 默认支持文件
                /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
                // 支持 js/ts 文件
                /\.([jt]s)($|\?)/
            ]
        }
    },
    // 预设
    presets: [
        // Tailwind 风格
        presetWind4(),
        // 自定义滚动条
        presetScrollbar()
    ],
    // 快捷方式
    shortcuts: {
        "flex-center": "flex justify-center items-center",
        "flex-x-center": "flex justify-center",
        "flex-y-center": "flex items-center"
    },
    // 自定义规则
    rules: [[/^text-(\d+(?:\.\d+)?)$/, ([, d]) => ({ "font-size": `calc(var(--base-font-size) * ${d})` })]]
})
