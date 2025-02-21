/*
 * @Author: dyb-dev
 * @Date: 2025-02-21 16:31:22
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-21 16:33:25
 * @FilePath: /web-mobile-template/vite/utils/env.ts
 * @Description: Vite 环境相关工具模块
 */

import { networkInterfaces } from "os"

import dayjs from "dayjs"

import pkg from "../../package.json"

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

/** CONST: 监听文件正则 */
let watchFileRegex: RegExp | void

/** CONST: 监听文件列表 */
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

export { generateProjectInfo, getAvailableIPv4HostIP, isIgnoreWatchFile }
