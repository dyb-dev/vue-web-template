/** vite环境变量 */
interface ImportMetaEnv {
    // CONST: 运行时注入的环境变量
    /** 运行时注入 基础路径 */
    readonly BASE_URL: string
    /** 运行时注入 是否为开发环境 */
    readonly DEV: boolean
    /**
     * 运行时注入 当前模式
     * - development: 开发环境
     * - production: 生产环境
     */
    readonly MODE: "development" | "production"
    /** 运行时注入 是否为生产环境 */
    readonly PROD: boolean
    /** 运行时注入 是否为服务端渲染模式 */
    readonly SSR: boolean

    // CONST: 公共
    /** 协议 默认:http  */
    readonly VITE_PROTOCOL: string
    /** 默认端口号 默认:8080 */
    readonly VITE_PORT: string
    /** 公共资源目录 默认:public */
    readonly VITE_PUBLIC_ASSETS_DIR: string
    /** 登录页面的路由 默认:/login */
    readonly VITE_LOGIN_ROUTE: string
    /** 需要登录的路由集合，如果涉及多个，用逗号分隔 默认:空 */
    readonly VITE_NEED_LOGIN_ROUTES: string
    /** 首页路由 默认:/home */
    readonly VITE_HOME_ROUTE: string
    /** 本地服务器代理目标域 默认:http://xxx.com/ */
    readonly VITE_PROXY_DOMAIN: string
    /** 接口请求基础路径 默认:/api */
    readonly VITE_API_BASE_PATH: string
    /** 是否启用暗黑主题 默认:false */
    readonly VITE_DARK: string
    /** 是否启用PWA 默认:false */
    readonly VITE_PWA: string
    /**
     * 资源基础路径
     * - 开发环境: 默认:/public
     * - 生产环境: 默认:/assets
     */
    readonly VITE_ASSETS_BASE_PATH: string

    // CONST: 生产环境
    /** 打包输出目录 默认:dist */
    readonly VITE_OUT_DIR: string
    /** 打包输出资源目录 默认:assets */
    readonly VITE_OUT_ASSETS_DIR: string
    /** 网站基础路径 默认:空 */
    readonly VITE_BASE_PATH: string
    /** html文件类型 默认:html */
    readonly VITE_HTML_FILE_TYPE: "html" | "aspx" | "php"
    /** 是否压缩html文件 默认:true */
    readonly VITE_HTML_MINIFY: string
    /** 是否输出源代码映射文件 默认:false */
    readonly VITE_OUT_SOURCEMAP: string
    /** 是否启用旧版浏览器支持 默认:true */
    readonly VITE_LEGACY_BROWSER_SUPPORT: string
}

/** 扩展 ImportMeta 接口 */
interface ImportMeta {
    readonly env: ImportMetaEnv
}
