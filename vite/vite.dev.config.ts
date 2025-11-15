/*
 * @FileDesc: vite开发环境配置
 */

import { isIgnoreWatchFile } from "./utils"

import type { ISetupEnvConfigParam } from "./types"
import type { UserConfig } from "vite"

/**
 * FUN: 设置开发环境配置
 *
 * @author dyb-dev
 * @date 24/04/2024/  14:16:58
 * @export
 * @param {ISetupEnvConfigParam} param - 参数
 * @returns {*}  {UserConfig}
 */
export const setupDevConfig = (param: ISetupEnvConfigParam): UserConfig => {

    const { projectRootDir, port, browserOpenUrl, env } = param
    const { VITE_API_BASE_PATH, VITE_PROXY_DOMAIN } = env

    return {
        server: {
            // 允许任何来源的请求，默认：'localhost'
            host: "0.0.0.0",
            // 端口号，默认： 5173
            port: port,
            // 若端口已被占用，尝试下一个可用端口
            strictPort: false,
            // 浏览器打开地址，默认：http://localhost:8080/
            open: browserOpenUrl,
            // 请求代理配置
            proxy: {
                [VITE_API_BASE_PATH]: {
                    // 代理目标服务器
                    target: VITE_PROXY_DOMAIN,
                    // 解决跨域
                    changeOrigin: true
                    // 根据当前请求路径，添加一个重写规则
                    // rewrite: (path) => path.replace(/^\/api/, ""),
                }
            },
            // 配置 CORS，允许任何源，默认：true
            cors: true,
            // 指定服务器响应的 header
            headers: {},
            // 启用默认配置的模块热更新，也可自定义配置
            hmr: true,
            watch: {
                // 监听文件修改所需要忽略的文件
                ignored: path => isIgnoreWatchFile(path, projectRootDir)
            },
            fs: {
                // 确保只有工作区根目录内的文件才能被访问，默认：true
                strict: true,
                // 由于安全隐患，不将这些文件暴露给客户端，启用默认值
                deny: [".env", ".env.*", "*.{crt,pem}"]
            },
            // 生成 sourcemap 中映射的源文件时，排除所有包含 node_modules 的路径，启用默认值
            sourcemapIgnoreList: sourcePath => sourcePath.includes("node_modules")
        }
    }

}
