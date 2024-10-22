/*
 * @Author: dyb-dev
 * @Date: 2023-11-08 15:55:25
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-22 13:27:25
 * @FilePath: /web-mobile-template/vite.config.ts
 * @Description: vite配置文件
 */

import { resolve } from "path"

import { px2viewport as VitePx2viewport } from "@mistjs/vite-plugin-px2viewport"
import ViteVue from "@vitejs/plugin-vue"
import PostcssAutoprefixer from "autoprefixer"
import { getPort } from "portfinder-sync"
import PostcssMobileForever from "postcss-mobile-forever"
import ViteRouter from "unplugin-vue-router/vite"
import { defineConfig, loadEnv, mergeConfig } from "vite"
import { createHtmlPlugin as ViteHtml } from "vite-plugin-html"
import ViteMkcert from "vite-plugin-mkcert"

import { generateProjectInfo, getAvailableIPv4HostIP, setupVitePWA } from "./vite/utils"
import { setupDevConfig } from "./vite/vite.dev.config"
import { setupProdConfig } from "./vite/vite.prod.config"

import type { ISetupEnvConfigParam } from "./vite/types"
import type { ConfigEnv, UserConfig } from "vite"

/** STATIC: 项目根目录 */
const projectRootDir = process.cwd()

/** STATIC: 是否开发模式 */
const isDevMode = process.env.NODE_ENV === "development"

export default defineConfig(({ mode }: ConfigEnv) => {
    /** STATIC: 获取.env文件的环境变量 */
    const _env = <ImportMetaEnv>loadEnv(mode, projectRootDir)

    /** STATIC: 项目信息 */
    const __PROJECT_INFO__ = generateProjectInfo(_env)

    // STATIC: 获取基础视口宽度函数
    const _getViewportWidth = (file: string) =>
        file.includes("node_modules/vant") || file.includes("node_modules/@dyb-dev/vant-pro") ? 375 : 750

    /** STATIC: 视口单位精度，精确到小数点后几位 */
    const _vwUnitPrecision = 3

    const { VITE_PORT, VITE_BASE_PATH, VITE_PROTOCOL, VITE_PWA, VITE_HTML_MINIFY } = _env

    /** STATIC: 端口号 */
    const _port = getPort(~~VITE_PORT)

    /** STATIC: 浏览器打开地址 */
    const _browserOpenUrl = `${VITE_PROTOCOL}://${getAvailableIPv4HostIP()}:${_port}`

    /** STATIC: 设置环境配置参数 */
    const _setupEnvConfigParam: ISetupEnvConfigParam = {
        projectRootDir,
        port: _port,
        browserOpenUrl: _browserOpenUrl,
        env: _env
    }

    /** STATIC: 开发环境配置 */
    const _devEnvConfig = setupDevConfig(_setupEnvConfigParam)

    /** STATIC: 当前环境配置 */
    const _currentEnvConfig: UserConfig = isDevMode
        ? _devEnvConfig
        : { ..._devEnvConfig, ...setupProdConfig(_setupEnvConfigParam) }

    /** STATIC: 基础环境配置 */
    const _baseEnvConfig: UserConfig = {
        // 项目根目录，默认： process.cwd()
        root: projectRootDir,
        // 开发或生产环境服务的公共基础路径，默认：/
        base: isDevMode ? "/" : VITE_BASE_PATH || "/",
        // 模式
        mode,
        // 公共资源目录，设置为空，否则开发环境下会误报错误，默认：public
        publicDir: "",
        // 存储预构建的依赖缓存文件的目录，默认：node_modules/.vite，如需重新生成缓存文件，可以使用 --force 命令行选项或手动删除目录
        cacheDir: "node_modules/.vite",
        // 终端输出等级，默认：info
        logLevel: "info",
        // 启动开发服务器时，清空终端，默认：true
        clearScreen: true,
        // 加载 .env 文件的目录，默认：root目录
        envDir: projectRootDir,
        // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中，默认：VITE_
        envPrefix: "VITE_",
        // 应用类型，默认：spa
        appType: "spa",

        resolve: {
            // 路径别名
            alias: {
                "@": resolve(projectRootDir, "./src")
            },
            // 导入时想要省略的扩展名集合
            extensions: [".js", ".ts", ".jsx", ".tsx", ".json", ".mjs", ".mts", ".cjs", ".cts"],
            // package.json 中，默认允许的 exports 情景
            conditions: ["import", "module", "browser", "default", "production", "development"],
            // package.json 中，在解析包的入口点时尝试的字段列表。注意：比从 exports 字段解析的情景导出优先级低：如果一个入口起点从 exports 成功解析，resolve.mainFields 将被忽略。
            mainFields: ["browser", "module", "jsnext:main", "jsnext"]
        },

        // 定义变量，编译时会将使用的地方替换为硬编码的形式
        define: {
            __PROJECT_INFO__: JSON.stringify(__PROJECT_INFO__)
        },

        css: {
            // CSS 处理的引擎，默认：postcss
            transformer: "postcss",
            // 开发过程中是否启用 sourcemap，默认：false
            devSourcemap: true,
            // 自定义postcss配置
            postcss: {
                plugins: [
                    // 自动添加css样式前缀，解决不同浏览器css兼容问题，兼容范围参考 `package.json` 中的 `browserslist` 字段
                    // @ts-ignore
                    PostcssAutoprefixer(),
                    // 移动端适配方案，将非行内样式 px 转换为 vw 单位
                    // @ts-ignore
                    PostcssMobileForever({
                        // 设计稿宽度 默认：750
                        viewportWidth: _getViewportWidth,
                        // 单位精确到小数点后几位？ 默认：3
                        unitPrecision: _vwUnitPrecision
                    })
                ]
            },
            // 指定传递给 CSS 预处理器的选项
            preprocessorOptions: {
                scss: {
                    // 使用最新的 js API编译
                    api: "modern-compiler",
                    additionalData: `
                        @use "${projectRootDir}/src/styles/scss-var.scss" as *;
                        @use "${projectRootDir}/src/styles/mixins/index.scss" as *;
                        @use "${projectRootDir}/src/styles/funs/index.scss" as *;
                    `
                }
            }
        },

        json: {
            // 是否支持从 .json 文件中进行按名导入，示例：import { name } from './package.json';
            namedExports: false,
            // 开启则会禁用按名导入,导入的 JSON 会被转换为 export default JSON.parse("...") 会比转译成对象字面量性能更好，
            stringify: true
        },

        // 根目录下指定排除不需要构建转换的静态资源文件，例如：3D 模型文件(.gltf)，内建支持的资源类型列表(https://github.com/vitejs/vite/blob/main/packages/vite/src/node/constants.ts)
        assetsInclude: [],

        plugins: [
            // Vue 路由生成 注意: 必须放在 ViteVue() 之前
            ViteRouter({
                // 指定需要扫描的页面目录
                routesFolder: [{ src: "src/views" }],
                // .d.ts文件输出路径
                dts: resolve(projectRootDir, "./src/types/dts/typed-router.d.ts")
            }),
            // 处理和编译 .vue 文件
            ViteVue(),
            // 替换html文件占位符
            ViteHtml({
                // 是否压缩html文件
                minify: VITE_HTML_MINIFY === "true",
                inject: {
                    data: {
                        version: __PROJECT_INFO__.version
                    }
                }
            }),
            // 移动端适配方案，将行内样式 px 转换为 vw 单位，且支持运行时动态 px 转换为 vw 单位
            VitePx2viewport({
                // 设计稿宽度 默认：750
                viewportWidth: _getViewportWidth,
                // 单位精确到小数点后几位？ 默认：4
                unitPrecision: _vwUnitPrecision
            }),
            // 是否使用https
            VITE_PROTOCOL === "https" &&
                ViteMkcert({
                    // 指定mkcert下载源
                    source: "coding",
                    // 证书保存路径
                    savePath: resolve(projectRootDir, "./dev-https-cert")
                }),
            // 是否使用 PWA 离线访问 当 pnpm preview 时，带有路径前缀，则浏览器地址栏需要添加 index.html，因为PWA的缓存路径带有index.html，否则离线刷新页面会出现404
            VITE_PWA === "true" &&
                setupVitePWA({
                    projectRootDir,
                    isDevMode,
                    env: _env,
                    __PROJECT_INFO__
                })
        ]
    }

    return mergeConfig(_baseEnvConfig, _currentEnvConfig)
})
