/*
 * @Author: dyb-dev
 * @Date: 2024-08-02 22:58:16
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-14 13:47:20
 * @FilePath: /vue-web-template/types/index.d.ts
 * @Description: app 和 node 公共的环境类型模块
 */

/** 项目信息(全局) */
declare interface IProjectInfo {
    /** 项目版本 */
    version: string
    /** 项目最后构建时间 */
    lastBuildTime: string
    /** 环境变量信息 */
    env: ImportMetaEnv
    /** `package.json`信息 */
    pkg: {
        /** 包名 */
        name: string
        /** 包版本 */
        version: string
        /** 生产依赖 */
        dependencies: Record<string, string>
    }
}

/** 项目信息(全局) */
declare const __PROJECT_INFO__: IProjectInfo
