/*
 * @FileDesc: Vite 插件模块
 */

import { existsSync, renameSync } from "fs"
import { resolve, basename } from "path"

import { VitePWA } from "vite-plugin-pwa"

import pkg from "../../package.json"

import type { PluginOption } from "vite"

/**
 * FUN: html根文件类型插件
 *
 * @author dyb-dev
 * @date 27/03/2024/  15:02:41
 * @export
 * @param {("html" | "aspx" | "php")} fileType  - html根文件类型
 * @param {string} outDir - 输出目录
 * @returns {*}  {PluginOption}
 */
export const ViteHtmlFileType = (fileType: "html" | "aspx" | "php", outDir: string): PluginOption => {

    try {

        // 参数类型错误
        if (typeof fileType !== "string" || typeof outDir !== "string") {

            throw "fileType | outDir 类型错误"

        }

        // 为默认类型，不做处理
        if (fileType === "html") {

            return null

        }

        return {
            name: "vite-plugin-html-filetype-changer",
            // 仅在打包构建时应用此插件
            apply: "build",
            // 其他插件之后执行该插件
            enforce: "post",
            // 插件修改html内容钩子（vite独有）
            transformIndexHtml(html) {

                let prefix = ""
                switch (fileType) {

                case "aspx":
                    prefix =
                            "\ufeff" +
                            '<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Index.aspx.cs" Inherits="Index" %>\n\n'
                    break
                case "php":
                    prefix =
                            "\ufeff" +
                            '<?php require_once(dirname(dirname(__FILE__)) . "/Cg/Itf/Php/CmnMis/IncludeFiles.php");require_once(dirname(dirname(__FILE__)) . "/Cg/Itf/Php/CommonSite.php");CommonSite::WeiXinAuthor(); ?>\n\n'
                    break

                }

                return prefix + html

            },
            // 关闭构建钩子（通用）
            closeBundle() {

                // 延时是由于同步获取index.html不存在，可能被其他的插件给影响到了
                setTimeout(() => {

                    const _outDirPath = process.cwd() + `/${outDir}/`
                    const _oldFilePath = _outDirPath + "index.html"
                    const _newFilePath = _outDirPath + `index.${fileType}`
                    // 检查文件是否存在
                    if (!existsSync(_oldFilePath)) {

                        console.error("\x1b[31m%s\x1b[0m", `ViteHtmlFileType() 找不到对应的根文件 _oldFilePath: ${_oldFilePath}`)
                        return

                    }
                    // 文件重命名
                    renameSync(_oldFilePath, _newFilePath)
                    console.log("\x1b[32m%s\x1b[0m", `ViteHtmlFileType() 根文件后缀更改成功 _newFilePath: ${_newFilePath}`)

                }, 5)

            }
        }

    }
    catch (error) {

        console.error("\x1b[31m%s\x1b[0m", `ViteHtmlFileType() ${error}`)

    }

}

/** 设置setupVitePWA参数 */
interface ISetupVitePWAParam {
    /** 项目根目录 */
    projectRootDir: string
    /** 是否开发模式 */
    isDevMode: boolean
    /** 环境变量 */
    env: ImportMetaEnv
    /** 项目信息 */
    __PROJECT_INFO__: IProjectInfo
}

/**
 * FUN: 设置VitePWA插件
 *
 * @author dyb-dev
 * @date 24/04/2024/  16:42:29
 * @export
 * @param {ISetupVitePWAParam} param - 参数
 * @returns {*}  {any[]}
 */
export const setupVitePWA = (param: ISetupVitePWAParam): any[] => {

    const {
        projectRootDir,
        isDevMode,
        env,
        __PROJECT_INFO__: { version }
    } = param
    const { VITE_OUT_DIR, VITE_ASSETS_BASE_PATH, VITE_HTML_FILE_TYPE, VITE_OUT_SOURCEMAP } = env

    /** CONST: icon路径前缀 */
    const _iconsPathPrefix = `${VITE_ASSETS_BASE_PATH}/image/sw/`

    /** CONST: 资源路径参数 */
    const _assetsPathParam = `?version=${version}`

    /** CONST: 哈希文件名的正则表达式模式 */
    const _hashPattern = /__.{8}\./

    return VitePWA({
        // manifest清单配置
        manifest: {
            name: pkg.name,
            short_name: pkg.name,
            description: pkg.description,
            theme_color: "#ffffff",
            icons: [
                {
                    src: `${_iconsPathPrefix}pwa-192x192.png${_assetsPathParam}`,
                    sizes: "192x192",
                    type: "image/png"
                },
                {
                    src: `${_iconsPathPrefix}pwa-512x512.png${_assetsPathParam}`,
                    sizes: "512x512",
                    type: "image/png"
                }
            ]
        },
        // 输出的 manifest清单 文件名 默认: manifest.webmanifest
        manifestFilename: "manifest.webmanifest",
        // 是否压缩manifest文件 默认: true
        minify: !isDevMode,
        // 是否预缓存manifest清单中的图标 默认: true
        includeManifestIcons: true,
        // 是否给 <link rel="manifest"> 标签添加 crossorigin="use-credentials" 属性 默认: false
        useCredentials: true,

        // 配置开发环境下的选项
        devOptions: {
            // 是否在开发模式下启用服务工作线程 默认: false
            enabled: true,
            // 服务工作线程类型，如果strategies:injectManifest必须使用模块化，默认: 'classic'
            type: "module",
            // 指定生成的服务工作线程存储位置。默认为 resolve(viteConfig.root, 'dev-dist')
            resolveTempFolder: () => resolve(projectRootDir, "dev-sw-dist")
        },

        // Service Worker脚本 创建策略，默认: generateSW
        // generateSW: 根据配置生成Service Worker脚本文件，一般不需要高度定制Service Worker的情况直接选择generateSW就行 （注意:该策略只支持 GET 请求缓存）
        // injectManifest: 使用自定义Service Worker脚本文件，注入资源列表到脚本中，自己控制缓存策略，一般适用于复杂一点的缓存策略
        strategies: "injectManifest",

        // strategies:injectManifest 时 自定义 Service Worker 脚本存放目录 默认: public
        srcDir: resolve(projectRootDir, "./src/sw"),
        // strategies:injectManifest 时 自定义 service worker 脚本文件名 默认: sw.js
        filename: "sw.ts",
        // 编译后的 Service Worker 脚本输出目录 默认: dist
        outDir: VITE_OUT_DIR,
        // service worker的注入方式,插件会自动注入 默认: auto
        injectRegister: "auto",
        // service worker的更新方式 autoUpdate:自动 prompt:手动 默认值: prompt
        registerType: "autoUpdate",
        // 是否关闭service worker （用于不需要用到sw时）
        selfDestroying: false,
        // strategies:injectManifest 时配置
        injectManifest: {
            // 构建时输出格式 默认: iife
            rollupFormat: "es",
            // 兼容目标 默认: modules
            target: "modules",
            // 是否添加源映射
            sourcemap: VITE_OUT_SOURCEMAP === "true",
            // 是否压缩sw脚本
            minify: !isDevMode,
            // 生成的预缓存清单注入在Service Worker脚本的位置 默认: self.__WB_MANIFEST
            injectionPoint: "self.__WB_MANIFEST",
            // 预缓存的文件的最大大小 默认: 2097152 字节（2MB）
            maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
            // `globPatterns`根据此目录来匹配文件
            globDirectory: VITE_OUT_DIR,
            // 首次进入网站时，预缓存清单需要包含的资源类型（注意: 预缓存清单只在生产环境有效）
            globPatterns: [
                "**/*.{ico,html,js,css,webp,jpg,jpeg,png,gif,svg,ttf,woff,woff2,otf,eot,mp3,wav,ogg,mp4,webm,json,bmp,psd,tiff,tga,eps}"
            ],
            // 需要额外添加的预缓存清单的资源
            // additionalManifestEntries: [],
            // 自定义修改和设置预缓存清单的内容
            manifestTransforms: [
                entries => {

                    const manifest = entries.map(entry => {

                        /** 预缓存清单的资源url */
                        const _url = entry.url
                        // 如果当前资源 url 不是`根文件`类型且不是包含`hash`的文件名时
                        if (!_url.includes(`.${VITE_HTML_FILE_TYPE}`) && !_hashPattern.test(basename(_url))) {

                            entry.url += _assetsPathParam

                        }
                        return entry

                    })

                    return { manifest }

                }
            ]
        }
    })

}
