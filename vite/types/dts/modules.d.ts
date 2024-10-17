/** 定义portfinder-sync导入模块，避免ts解析报错 */
declare module "portfinder-sync" {
    /** FUN: 获取可用端口号 */
    const getPort: (basePort: number) => number
    export { getPort }
}
