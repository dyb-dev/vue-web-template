/*
 * @FileDesc: vite生产环境配置
 */

import { resolve } from "path"

import ViteLegacy from "@vitejs/plugin-legacy"
import RollupCopy from "rollup-plugin-copy"

import { ViteHtmlFileType, assetFileNames, getCopyFileList, manualChunks } from "./utils"

import type { ISetupEnvConfigParam } from "./types"
import type { PluginOption, UserConfig } from "vite"

/**
 * FUN: 设置生产环境配置
 *
 * @author dyb-dev
 * @date 24/04/2024/  14:16:18
 * @export
 * @param {ISetupEnvConfigParam} param - 参数
 * @returns {*}  {UserConfig}
 */
export const setupProdConfig = (param: ISetupEnvConfigParam): UserConfig => {

    const { projectRootDir, port, browserOpenUrl, env } = param
    const {
        VITE_HTML_FILE_TYPE,
        VITE_OUT_DIR,
        VITE_PUBLIC_ASSETS_DIR,
        VITE_OUT_ASSETS_DIR,
        VITE_BASE_PATH,
        VITE_OUT_SOURCEMAP,
        VITE_LEGACY_BROWSER_SUPPORT
    } = env

    /** CONST: rollup打包需排除的库列表,示例：["zepto.min.js"]（如果文件来自public/js，需html通过script引入，如果该文件支持模块化，引入时需添加type="module"） */
    const rollupExternalLibList: string[] = []

    /** CONST: 输出文件名模板 */
    const _outFileNameTemplate = "[name]__[hash:8]"

    return {
        plugins: [
            VITE_LEGACY_BROWSER_SUPPORT === "true" &&
                (ViteLegacy({
                    // 需要支持的目标浏览器
                    targets: ["defaults", "not op_mini all", "not IE 11"],
                    // regenerator-runtime/runtime: 为了支持 async/await 语法和生成器函数 例如：IE11浏览器
                    additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
                    // 为现代浏览器构建生成一个单独的polyfill块（目标是支持广泛可用特性的浏览器）
                    modernPolyfills: true
                }) as unknown as PluginOption),
            // 复制文件或目录的插件
            RollupCopy({
                targets: getCopyFileList(VITE_PUBLIC_ASSETS_DIR, VITE_OUT_DIR, VITE_OUT_ASSETS_DIR),
                // 由于会被 emptyOutDir 选项影响到，监听 vite 构建完时开始拷贝
                hook: "writeBundle"
            }),
            // 修改 index.html 文件类型的插件
            ViteHtmlFileType(VITE_HTML_FILE_TYPE, VITE_OUT_DIR)
        ],

        // 配置模拟生产环境，并启动一个服务器，查看最终打包的应用（其他配置大致保持与server一致）
        preview: {
            // 端口号，默认： 4173
            port: port,
            // 浏览器打开地址，默认：http://localhost:8080/，此处与开发环境不同，如果配置了项目资源目录前缀，则需要添加，并且如果使用PWA，则需要添加index.html文件类型，因为PWA的缓存路径带有index.html，否则离线刷新页面会出现404
            open: `${browserOpenUrl}${VITE_BASE_PATH}/index.${VITE_HTML_FILE_TYPE}`
        },

        esbuild: {
            // 移除 console.log 语句
            pure: ["console.log"],
            // 移除 debugger 语句
            drop: ["debugger"],
            // 移除 所有注释
            legalComments: "none"
        },

        build: {
            // 输出打包结果目录路径，默认：dist
            outDir: VITE_OUT_DIR,
            // dist目录下资源目录名，默认：assets
            assetsDir: VITE_OUT_ASSETS_DIR,
            // 小于此阈值的导入或引用资源内联为 base64 编码，避免额外的 http 请求，默认：4096 (4 KiB)
            assetsInlineLimit: 4096,
            // 启用模块预加载，提高加载页面速度，默认：{ polyfill: true }
            modulePreload: { polyfill: true },
            // 设置css压缩器，默认：与 build.minify 一致
            cssMinify: "esbuild",
            // 需要兼容安卓微信中的 webview 时启用，原因：(https://cn.vitejs.dev/config/build-options.html#build-csstarget)，默认：与 build.target 一致
            cssTarget: ["chrome61"],
            // CSS 代码拆分，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时一并获取，默认：true
            cssCodeSplit: true,
            // 设置js压缩器，默认：esbuild
            minify: "esbuild",
            // 构建的浏览器兼容目标 默认：modules，由于使用了@vitejs/plugin-legacy插件，所以此处会被覆盖
            // target: "modules",
            // 构建后是否生成 source map 文件，默认：false
            sourcemap: VITE_OUT_SOURCEMAP === "true",
            // 清空dist目录文件，默认： 若 outDir 在 root 目录下，则为 true
            emptyOutDir: true,
            // 将构建后的文件写入磁盘，默认：true
            write: true,
            // 禁用将 publicAssetsDir 目录中的所有文件复制到 outDir 目录中，(注意：使用rollupPluginCopy手动拷贝)，默认：true
            copyPublicDir: false,
            // 禁用 gzip 压缩大小报告，压缩大型输出文件可能会很慢，禁用该功能可能会提高大型项目的构建性能，默认：true
            reportCompressedSize: false,
            // 禁用监听文件改变时自动重新构建，感觉没必要，默认：null
            watch: null,
            // rollup自定义配置
            rollupOptions: {
                // 使用bundle的缓存属性，只对改变的模块重新分析，加速构建，默认：true
                cache: true,
                // 入口文件，可以设置多个
                input: {
                    index: resolve(projectRootDir, "./index.html")
                },
                // 打包时需要排除的库
                external: source => rollupExternalLibList.some(file => source.includes(file)),
                output: {
                    // 自动生成的代码片段配置
                    generatedCode: {
                        // 允许使用箭头函数，在某些js引擎中可以提供更好的性能，默认：false
                        arrowFunctions: true,
                        // 允许使用const，不使用var，默认：false
                        constBindings: true,
                        // 当对象属性名称与值匹配时，允许在对象中使用别名，默认：false
                        objectShorthand: true,
                        // 允许使用Symbol，为了兼容某些库和框架的特征检测，在一些代码中进行字符串转换时，得到的结果是 [object Module]，默认：false
                        symbols: true
                    },
                    // 用于压缩 Rollup 产生的额外代码，默认：false
                    compact: true,
                    // 指定生成的 bundle 的格式，默认：es
                    format: "es",
                    // 入口js文件名
                    entryFileNames: `${VITE_OUT_ASSETS_DIR}/js/${_outFileNameTemplate}.js`,
                    // js块文件名
                    chunkFileNames: `${VITE_OUT_ASSETS_DIR}/js/${_outFileNameTemplate}.js`,
                    // 自定义资源文件名
                    assetFileNames: ({ name }) => assetFileNames(name as string, VITE_OUT_ASSETS_DIR, _outFileNameTemplate),
                    // 自定义js Chunk 拆分策略
                    manualChunks: (id: string, { getModuleInfo }) => manualChunks(id, getModuleInfo)
                }
            }
        }
    }

}
