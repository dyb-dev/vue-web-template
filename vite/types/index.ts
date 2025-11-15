/*
 * @FileDesc: node 环境类型模块
 */

/** 设置vite环境配置函数参数 */
interface ISetupEnvConfigParam {
    /** 项目根目录 */
    projectRootDir: string
    /** 端口号 */
    port: number
    /** 浏览器打开地址 */
    browserOpenUrl: string
    /** 环境变量 */
    env: ImportMetaEnv
}

export type { ISetupEnvConfigParam }
