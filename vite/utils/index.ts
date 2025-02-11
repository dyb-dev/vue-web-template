/*
 * @Author: dyb-dev
 * @Date: 2024-01-28 19:52:10
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-11 17:22:25
 * @FilePath: /web-mobile-template/vite/utils/index.ts
 * @Description: vite配置相关工具函数
 */

import { readdirSync, statSync, existsSync, renameSync } from "fs"
import { networkInterfaces } from "os"
import { join, resolve, basename } from "path"

import dayjs from "dayjs"
import { VitePWA } from "vite-plugin-pwa"

import pkg from "../../package.json"

import type { GetModuleInfo } from "rollup"
import type { PluginOption } from "vite"

/**
 * FUN: 生成项目信息
 *
 * @author dyb-dev
 * @date 30/09/2024/  15:00:27
 * @param {ImportMetaEnv} env - 环境变量
 * @returns {*}  {IProjectInfo}
 */
const generateProjectInfo = (env: ImportMetaEnv): IProjectInfo => {

    const { name, version, dependencies } = pkg
    const _dayObj = dayjs()
    const _projectVersion = _dayObj.format("YYYYMMDDHHmmss")
    const _lastBuildTime = _dayObj.format("YYYY-MM-DD HH:mm:ss")

    const _projectInfo: IProjectInfo = {
        version: _projectVersion,
        lastBuildTime: _lastBuildTime,
        env,
        pkg: { name, version, dependencies }
    }

    return _projectInfo

}

/**
 * 文件目标接口
 */
interface ICopyFileItem {
    /** 源文件路径 */
    src: string
    /** 输出的目标路径 */
    dest: string
}

/** STATIC: 忽略文件列表 */
const IGNORE_FILE_LIST = [".md", ".DS_Store"]

/**
 * FUN: 获取拷贝文件列表
 *
 * @author dyb-dev
 * @date 10/07/2024/  16:27:05
 * @export
 * @param {string} publicAssetsDir - 公共资源目录
 * @param {string} outDir - 打包输出目录
 * @param {string} outAssetsDir - 输出资源目录
 * @param {string[]} [ignoreFileList=[".md", ".DS_Store"]] - 复制文件时需要忽略的文件列表
 * @returns {*}  {IFileTarget[]}
 */
const getCopyFileList = (
    publicAssetsDir: string,
    outDir: string,
    outAssetsDir: string,
    ignoreFileList: string[] = IGNORE_FILE_LIST
): ICopyFileItem[] => {

    // 参数为空
    if (!publicAssetsDir || !outDir || !outAssetsDir || !ignoreFileList) {

        throw new Error("getCopyFileList() publicAssetsDir | outDir | outAssetsDir | ignoreFileList is required!")

    }
    // 参数类型错误
    if (
        publicAssetsDir.constructor !== String ||
        outDir.constructor !== String ||
        outAssetsDir.constructor !== String ||
        ignoreFileList.constructor !== Array
    ) {

        throw new Error("getCopyFileList() publicAssetsDir | outDir | outAssetsDir | ignoreFileList type error!")

    }

    const _fileList: string[] = [],
        _dirList: string[] = []

    /** 获取公共资源目录子列表 */
    const _filesInPublicAssetsDir = readdirSync(publicAssetsDir)

    _filesInPublicAssetsDir.forEach(fileName => {

        // 为忽略文件时
        if (isIncludedIgnoreFile(fileName, ignoreFileList)) {

            return

        }

        const _filePath = join(publicAssetsDir, fileName)
        const _fileStats = statSync(_filePath)

        /** 文件 */
        if (_fileStats.isFile()) {

            _fileList.push(fileName)

        }
        else if (_fileStats.isDirectory()) {

            /** 文件夹 */
            /** 目录内有可用文件时 */
            if (isAvailableFilesInDir(_filePath, ignoreFileList)) {

                _dirList.push(fileName)

            }

        }

    })

    return [
        ..._fileList.map(fileName => ({
            src: join(publicAssetsDir, fileName),
            dest: `${outDir}/${outAssetsDir}`
        })),
        ..._dirList.map(dirName => ({
            src: join(publicAssetsDir, `${dirName}/*`),
            dest: `${outDir}/${outAssetsDir}/${dirName}`
        }))
    ]

}

/**
 * FUN: 是否包含忽略文件
 *
 * @author dyb-dev
 * @date 27/03/2024/  14:26:37
 * @param {string} fileName - 文件名字
 * @param {string[]} [ignoreFileList=[]] - 忽略文件列表
 * @returns {*}  {boolean}
 */
const isIncludedIgnoreFile = (fileName: string, ignoreFileList: string[] = []): boolean =>
    ignoreFileList.some(item => fileName.includes(item))

/**
 * FUN: 目录内是否包含可用文件
 *
 * @author dyb-dev
 * @date 27/03/2024/  14:26:18
 * @param {string} dirPath - 目录路径
 * @param {string[]} [ignoreFileList=[]] - 忽略文件列表
 * @returns {*}  {boolean}
 */
const isAvailableFilesInDir = (dirPath: string, ignoreFileList: string[] = []): boolean => {

    const _filesInDir = readdirSync(dirPath)

    return _filesInDir.some(fileName => {

        if (isIncludedIgnoreFile(fileName, ignoreFileList)) {

            return false

        }

        const _filePath = join(dirPath, fileName)
        const _fileStats = statSync(_filePath)

        /** 文件 */
        if (_fileStats.isFile()) {

            return true

        }
        else if (_fileStats.isDirectory()) {

            /** 文件夹 */
            return isAvailableFilesInDir(_filePath, ignoreFileList)

        }

    })

}

/**
 * FUN: 获取可用IPv4主机ip(192.168.10.191)
 *
 * @author dyb-dev
 * @date 26/03/2024/  22:56:49
 * @export
 * @returns {*}  {string}
 */
const getAvailableIPv4HostIP = (): string => {

    const _address = networkInterfaces().en0?.find(details => !details.internal && details.family === "IPv4")?.address
    if (!_address) {

        console.error("getAvailableIPv4HostIP() 获取可用IPv4主机ip失败！")
        return "localhost"

    }

    return _address

}

/** STATIC: 监听文件正则 */
let watchFileRegex: RegExp | void

/** STATIC: 监听文件列表 */
const WATCH_FILE_LIST = ["public", "src", "index.html"]

/**
 * FUN: 是否忽略监听文件
 *
 * @author dyb-dev
 * @date 24/04/2024/  16:37:59
 * @export
 * @param {string} path - 检查的文件路径
 * @param {string} projectRootDir  - 项目根目录
 * @param {string[]} [watchFileList=["public", "src", "index.html"]] - 监听文件列表
 * @returns {*}  {boolean}
 */
const isIgnoreWatchFile = (path: string, projectRootDir: string, watchFileList: string[] = WATCH_FILE_LIST): boolean => {

    // 如果没有创建正则表达式
    if (!watchFileRegex) {

        watchFileRegex = new RegExp(watchFileList.map(file => `${projectRootDir}/${file}`).join("|"))

    }
    // 如果是根目录
    if (path === projectRootDir) {

        return false

    }
    return !watchFileRegex.test(path)

}

/** STATIC: 资源模块拆分配置（输出目录名:文件类型集合） */
const ASSET_MODULE_SPLIT_CONFIG = {
    audio: "mp3,wav,ogg",
    css: "css",
    document: "docx,pdf",
    font: "ttf,otf,woff,woff2,eot,svg",
    image: "jpg,jpeg,png,gif,bmp,webp",
    js: "js",
    video: "mp4,webm"
}

/** STATIC: 资源模块拆分配置 `key` 列表 */
const ASSET_MODULE_SPLIT_CONFIG_KEY_LIST = Object.keys(ASSET_MODULE_SPLIT_CONFIG)

/**
 * FUN: 自定义资源文件名
 *
 * @author dyb-dev
 * @date 22/07/2024/  16:58:52
 * @export
 * @param {string} fileName - 文件名
 * @param {string} outAssetsDir - 输出资源目录
 * @param {string} outFileNameTemplate - 输出文件名模板
 * @param {Record<string,string>} [splitConfig=assetModuleSplitConfig] - 资源模块拆分配置（输出目录名:文件类型集合）
 * @returns {*}  {string}
 */
const assetFileNames = (
    fileName: string,
    outAssetsDir: string,
    outFileNameTemplate: string,
    splitConfig: Record<string, string> = ASSET_MODULE_SPLIT_CONFIG
): string => {

    if (!fileName || !splitConfig) {

        throw new Error("assetFileNames() fileName | splitConfig is required!")

    }

    if (fileName.constructor !== String || splitConfig.constructor !== Object) {

        throw new Error("assetFileNames() fileName | splitConfig type error!")

    }

    const _assetFileType = fileName.split(".")[1]

    // 为ico或无文件类型时
    if (_assetFileType === "ico" || !_assetFileType) {

        return `${outAssetsDir}/${outFileNameTemplate}[extname]`

    }

    // 资源目录名
    let _assetsDirName = ""

    for (const assetsDirName of ASSET_MODULE_SPLIT_CONFIG_KEY_LIST) {

        const _assetsTypes = splitConfig[assetsDirName]
        if (_assetsTypes.constructor !== String) {

            throw new Error("assetFileNames() splitConfig[assetsDirName] type error!")

        }
        // 该目录的文件类型集合包含该文件类型
        if (_assetsTypes.includes(_assetFileType)) {

            _assetsDirName = assetsDirName
            break

        }

    }

    // 无资源目录名
    if (!_assetsDirName) {

        return `${outAssetsDir}/[ext]/${outFileNameTemplate}[extname]`

    }

    return `${outAssetsDir}/${_assetsDirName}/${outFileNameTemplate}[extname]`

}

// STATIC: 第三方模块拆分配置（chunk名:模块集合）
const THIRD_PARTY_MODULE_SPLIT_CONFIG = {
    "vue-vendor": ["vue", "vue-router", "pinia", "pinia-plugin-persistedstate", "@vueuse/core"],
    "vant-vendor": ["vant", "@dyb-dev/vant-pro"],
    "utils-vendor": ["axios", "dayjs", "query-string"],
    "vconsole-vendor": ["vconsole"]
}

/** STATIC: 第三方模块拆分配置 `key` 列表 */
const THIRD_PARTY_MODULE_SPLIT_CONFIG_KEY_LIST = Object.keys(THIRD_PARTY_MODULE_SPLIT_CONFIG)

/**
 * FUN: 自定义第三方模块chunk拆分
 *
 * @author dyb-dev
 * @date 28/03/2024/  12:33:08
 * @export
 * @param {string} id - 模块id
 * @param {GetModuleInfo} getModuleInfo - 获取模块信息函数
 * @param {Record<string,string[]>} [splitConfig=thirdPartyModuleSplitConfig] - 第三方模块拆分配置（chunk名:模块集合）
 * @returns {*}  {(string | void)} - 拆分的chunk名
 */
const manualChunks = (
    id: string,
    getModuleInfo: GetModuleInfo,
    splitConfig: Record<string, string[]> = THIRD_PARTY_MODULE_SPLIT_CONFIG
): string | void => {

    // 参数为空
    if (!id || !getModuleInfo || !splitConfig) {

        throw new Error("manualChunks() id | getModuleInfo | splitConfig is required!")

    }
    // 参数类型错误
    if (id.constructor !== String || getModuleInfo.constructor !== Function || splitConfig.constructor !== Object) {

        throw new Error("manualChunks() id | getModuleInfo | splitConfig type error!")

    }

    if (id.includes("node_modules")) {

        for (const chunkKey of THIRD_PARTY_MODULE_SPLIT_CONFIG_KEY_LIST) {

            const _depModules = splitConfig[chunkKey]
            // _depModules类型错误
            if (_depModules.constructor !== Array) {

                throw new Error("manualChunks() splitConfig[chunkKey] type error!")

            }
            // _depModules索引项类型错误
            if (_depModules.some(item => item.constructor !== String)) {

                throw new Error("manualChunks() _depModules[key] type error!")

            }
            // 递归向上查找引用者，检查是否命中 splitConfig 声明的包
            if (isDepInclude(id, _depModules, [], getModuleInfo)) {

                return chunkKey

            }

        }
        return "other-vendor"

    }

}

/** STATIC: 模块缓存Map对象 */
const MODULE_CACHE = new Map()

/**
 * FUN: 是否命中包含
 *
 * @author dyb-dev
 * @date 27/03/2024/  14:37:20
 * @export
 * @param {string} id - 模块标识符
 * @param {string[]} depModules - 命中模块集合
 * @param {string[]} importChain - 向上导入链
 * @param {GetModuleInfo} getModuleInfo - 获取模块信息函数
 * @returns {*}  {(boolean | undefined)}
 */
const isDepInclude = (
    id: string,
    depModules: string[],
    importChain: string[],
    getModuleInfo: GetModuleInfo
): boolean | undefined => {

    const key = `${id}-${depModules.join("|")}`

    /** 出现循环依赖，不考虑 */
    if (importChain.includes(id)) {

        MODULE_CACHE.set(key, false)
        return false

    }

    /** 验证缓存 */
    if (MODULE_CACHE.has(key)) {

        return MODULE_CACHE.get(key)

    }

    /** 命中依赖集合 */
    if (isDepModules(id, depModules)) {

        /** 引用链中的文件都记录到缓存中 */
        importChain.forEach(item => MODULE_CACHE.set(`${item}-${depModules.join("|")}`, true))
        return true

    }

    const moduleInfo = getModuleInfo(id)
    /** 没有模块信息或者没有引用该模块的模块 */
    if (!moduleInfo || !moduleInfo.importers) {

        MODULE_CACHE.set(key, false)
        return false

    }

    /** 核心逻辑，递归查找上层引用者 */
    const isInclude = moduleInfo.importers.some((importer: string) =>
        isDepInclude(importer, depModules, importChain.concat(id), getModuleInfo)
    )
    /** 设置缓存 */
    MODULE_CACHE.set(key, isInclude)

    return isInclude

}

/**
 * FUN: 是否命中模块集合
 *
 * @author dyb-dev
 * @date 26/03/2024/  22:54:57
 * @param {string} id - 模块id
 * @param {string[]} depModules - 比对模块
 * @returns {*}  {boolean}
 */
const isDepModules = (id: string, depModules: string[]): boolean => depModules.some(item => id.includes(`/${item}/`))

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
const ViteHtmlFileType = (fileType: "html" | "aspx" | "php", outDir: string): PluginOption => {

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
const setupVitePWA = (param: ISetupVitePWAParam): any[] => {

    const {
        projectRootDir,
        isDevMode,
        env,
        __PROJECT_INFO__: { version }
    } = param
    const { VITE_OUT_DIR, VITE_ASSETS_BASE_PATH, VITE_HTML_FILE_TYPE, VITE_OUT_SOURCEMAP } = env

    /** STATIC: icon路径前缀 */
    const _iconsPathPrefix = `${VITE_ASSETS_BASE_PATH}/image/sw/`

    /** STATIC: 资源路径参数 */
    const _assetsPathParam = `?version=${version}`

    /** STATIC: 哈希文件名的正则表达式模式 */
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

export {
    generateProjectInfo,
    getCopyFileList,
    isIncludedIgnoreFile,
    isAvailableFilesInDir,
    getAvailableIPv4HostIP,
    isIgnoreWatchFile,
    assetFileNames,
    manualChunks,
    setupVitePWA,
    ViteHtmlFileType
}
