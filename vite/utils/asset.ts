/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 16:31:15
 * @LastEditors: v_zhgtzhong
 * @LastEditTime: 2025-08-01 00:14:20
 * @FilePath: /vue-web-template/vite/utils/asset.ts
 * @Description: Vite 资源处理模块
 */

import { readdirSync, statSync } from "fs"
import { join } from "path"

import type { GetModuleInfo } from "rollup"

/**
 * 文件目标接口
 */
interface ICopyFileItem {
    /** 源文件路径 */
    src: string
    /** 输出的目标路径 */
    dest: string
}

/** CONST: 忽略文件列表 */
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
export const getCopyFileList = (
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
export const isIncludedIgnoreFile = (fileName: string, ignoreFileList: string[] = []): boolean =>
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
export const isAvailableFilesInDir = (dirPath: string, ignoreFileList: string[] = []): boolean => {

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

/** CONST: 资源模块拆分配置（输出目录名:文件类型集合） */
const ASSET_MODULE_SPLIT_CONFIG = {
    audio: "mp3,wav,ogg",
    css: "css",
    document: "docx,pdf",
    font: "ttf,otf,woff,woff2,eot,svg",
    image: "jpg,jpeg,png,gif,bmp,webp",
    js: "js",
    video: "mp4,webm"
}

/** CONST: 资源模块拆分配置 `key` 列表 */
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
export const assetFileNames = (
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

// CONST: 第三方模块拆分配置（chunk名:模块集合）
const THIRD_PARTY_MODULE_SPLIT_CONFIG = {
    "vue-vendor": ["vue", "vue-router", "pinia", "pinia-plugin-persistedstate", "@vueuse/core"],
    "vant-vendor": ["vant", "@dyb-dev/vant-pro"],
    "utils-vendor": ["axios", "dayjs", "query-string"],
    "vconsole-vendor": ["vconsole"]
}

/** CONST: 第三方模块拆分配置 `key` 列表 */
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
export const manualChunks = (
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

/** CONST: 模块缓存Map对象 */
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
