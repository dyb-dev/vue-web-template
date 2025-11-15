/*
 * @FileDesc: json 相关工具函数
 */

import { saveAs } from "file-saver"

/** 下载 JSON 文件 配置选项 */
export interface IDownloadJsonOptions {
    /**
     * 文件名
     * - 如果不包含扩展名，则自动添加 `.json`
     * - 例子：`data`、`backup-2023-09-08`、`my-file.json`
     * - 注意：文件名不能包含特殊字符，如 `/\?%*:|"<>` 等
     *
     * @default 当前时间，格式为 `YYYY-MM-DDTHH-MM-SS`
     */
    filename?: string
    /**
     * 是否格式化
     *
     * @default true
     */
    prettify?: boolean
    /**
     * JSON 缩进空格数
     * - 如果 `prettify` 为 `false`，则此选项无效
     * - 取值范围：0-10
     *
     * @default 2
     */
    indent?: number
    /**
     * 是否验证文件名合法性
     *
     * @default true
     */
    validateFilename?: boolean
}

/**
 * FUN: 下载 JS 对象为 JSON 文件
 *
 * @author dyb-dev
 * @date 2025-09-09 12:09:39
 * @template T
 * @param {T} data 要下载的 JS 对象
 * @param {IDownloadJsonOptions} [options={}] 下载配置选项
 */
export const downloadJson = <T = any>(data: T, options: IDownloadJsonOptions = {}): void => {

    try {

        if (data === null || data === undefined) {

            throw new Error("下载数据不能为空")

        }

        const {
            filename = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19),
            prettify = true,
            indent = 2,
            validateFilename: shouldValidate = true
        } = options

        const validIndent = Math.max(0, Math.min(10, Math.floor(Number(indent) || 0)))

        /** 基础文件名 */
        const baseFilename = filename.endsWith(".json") ? filename.slice(0, -5) : filename
        /** 最终文件名 */
        let finalFilename: string

        if (shouldValidate) {

            const sanitized = sanitizeFilename(baseFilename)
            if (baseFilename !== sanitized) {

                console.warn(`文件名已自动清理：${baseFilename} -> ${sanitized}`)

            }
            finalFilename = `${sanitized}.json`
            if (!validateFilename(finalFilename)) {

                throw new Error("文件名包含非法字符且无法自动修复")

            }

        }
        else {

            finalFilename = `${baseFilename}.json`

        }

        let jsonString: string
        try {

            jsonString = prettify ? JSON.stringify(data, null, validIndent) : JSON.stringify(data)

        }
        catch (serializeError) {

            if (serializeError instanceof TypeError && serializeError.message.includes("circular")) {

                throw new Error("数据包含循环引用，无法转换为 JSON")

            }
            throw new Error(
                `数据无法序列化为 JSON 格式: ${serializeError instanceof Error ? serializeError.message : "未知错误"}`
            )

        }

        /** 文件大小（MB） */
        const sizeInMB = new Blob([jsonString]).size / (1024 * 1024)
        if (sizeInMB > 50) {

            console.warn(`生成的 JSON 文件较大 (${sizeInMB.toFixed(1)}MB)，下载可能需要一些时间`)

        }

        const blob = new Blob([jsonString], { type: "application/json;charset=utf-8" })
        saveAs(blob, finalFilename)

    }
    catch (error) {

        throw new Error(`JSON 文件下载失败: ${error instanceof Error ? error.message : "未知错误"}`)

    }

}

/** 解析 JSON 文件配置选项 */
export interface IParseJsonOptions {
    /**
     * 编码格式
     *
     * @default 'utf-8'
     */
    encoding?: string
    /**
     * 是否严格模式
     * - 严格模式下，解析结果必须是非空对象，否则抛出错误
     *
     * @default true
     */
    strict?: boolean
    /**
     * 文件大小限制（字节）
     * - 设置为 0 表示不限制大小
     *
     * @default 10 * 1024 * 1024 (10MB)
     */
    maxSize?: number
    /**
     * 进度回调函数
     *
     * @param progress 0-100 的进度百分比
     */
    onProgress?: (progress: number) => void
    /**
     * 是否使用流式解析（适用于大文件）
     *
     * @default false
     */
    useStreaming?: boolean
    /**
     * MIME 类型严格检查
     *
     * @default true
     */
    strictMimeCheck?: boolean
}

/**
 * FUN: 流式解析 JSON 文件
 *
 * @author dyb-dev
 * @date 2025-09-09 12:09:00
 * @template T
 * @param {File} file 要解析的 JSON 文件
 * @param {IParseJsonOptions} options 解析配置选项
 * @returns {*}  {Promise<T>} 解析后的 JS 对象
 */
const parseJsonFileStreaming = async <T = any>(file: File, options: IParseJsonOptions): Promise<T> => {

    const { onProgress, strict = true, encoding = "utf-8" } = options

    if (!isStreamingSupported()) {

        throw new Error("当前浏览器不支持流式读取，请使用传统模式")

    }

    // 确保 reader 在任何情况下都能被释放
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null

    try {

        const stream = file.stream()
        reader = stream.getReader()
        const decoder = new TextDecoder(encoding)

        let content = ""
        const totalSize = file.size
        let loadedSize = 0

        let reading = true

        while (reading) {

            const { done, value } = await reader.read()
            if (done) {

                reading = false
                break

            }

            loadedSize += value.byteLength
            content += decoder.decode(value, { stream: true })

            if (onProgress && totalSize > 0) {

                const progress = calculateProgress(loadedSize, totalSize)
                // 最多到95%，留5%给解析
                onProgress(Math.min(progress, 95))

            }

        }
        // 完成解码
        content += decoder.decode()

        if (!content.trim()) {

            throw new Error("文件内容为空")

        }

        onProgress?.(95)

        let parsedData: any
        try {

            parsedData = JSON.parse(content)

        }
        catch (parseError) {

            if (parseError instanceof SyntaxError) {

                throw new Error(`JSON 格式错误: ${parseError.message}`)

            }
            throw parseError

        }

        if (strict && (parsedData === null || parsedData === undefined)) {

            throw new Error("JSON 文件解析结果为空")

        }

        onProgress?.(100)
        return parsedData

    }
    catch (error) {

        if (error instanceof Error) {

            throw error

        }
        throw new Error(`流式解析失败: ${String(error)}`)

    }
    finally {

        if (reader) {

            try {

                reader.releaseLock()

            }
            catch (e) {

                console.warn("释放 stream reader 时出错:", e)

            }

        }

    }

}

/**
 * FUN: 解析 JSON 文件为 JS 对象（支持进度回调和流式处理）
 *
 * @author dyb-dev
 * @date 2025-09-09 12:08:33
 * @template T
 * @param {File} file 要解析的 JSON 文件
 * @param {IParseJsonOptions} [options={}] 解析配置选项
 * @returns {*}  {Promise<T>} 解析后的 JS 对象
 */
export const parseJsonFile = <T = any>(file: File, options: IParseJsonOptions = {}): Promise<T> => {

    return new Promise((resolve, reject) => {

        if (!file) {

            return reject(new Error("文件不能为空"))

        }

        const {
            encoding = "utf-8",
            strict = true,
            maxSize = 10 * 1024 * 1024, // 10MB
            onProgress,
            useStreaming = false,
            strictMimeCheck = true
        } = options

        if (!isValidJsonFile(file, strictMimeCheck)) {

            return reject(new Error("请选择有效的 JSON 文件"))

        }

        if (maxSize > 0 && file.size > maxSize) {

            const sizeInMB = (maxSize / (1024 * 1024)).toFixed(1)
            return reject(new Error(`文件大小不能超过 ${sizeInMB}MB`))

        }

        // **【改进】** 在决定是否流式处理前，检查浏览器支持情况
        const canStream = isStreamingSupported()
        const shouldUseStreaming = (useStreaming || file.size > 50 * 1024 * 1024) && canStream

        if (shouldUseStreaming) {

            parseJsonFileStreaming<T>(file, options).then(resolve).catch(reject)
            return

        }

        const reader = new FileReader()
        reader.onloadstart = () => onProgress?.(0)
        reader.onprogress = event => {

            if (event.lengthComputable && onProgress) {

                onProgress(calculateProgress(event.loaded, event.total))

            }

        }
        reader.onerror = () => reject(new Error("读取文件失败，请检查文件是否损坏"))
        reader.onabort = () => reject(new Error("文件读取被中止"))

        reader.onload = event => {

            try {

                const content = event.target?.result as string
                if (!content?.trim()) {

                    return reject(new Error("文件内容为空"))

                }
                onProgress?.(95)

                let parsedData: any
                try {

                    parsedData = JSON.parse(content)

                }
                catch (parseError) {

                    const msg =
                        parseError instanceof SyntaxError
                            ? `JSON 格式错误: ${parseError.message}`
                            : `解析 JSON 时发生错误: ${parseError instanceof Error ? parseError.message : "未知错误"}`
                    return reject(new Error(msg))

                }

                if (strict && (parsedData === null || parsedData === undefined)) {

                    return reject(new Error("JSON 文件解析结果为空"))

                }

                onProgress?.(100)
                resolve(parsedData as T)

            }
            catch (error) {

                reject(new Error(`解析文件失败: ${error instanceof Error ? error.message : "未知错误"}`))

            }

        }

        try {

            reader.readAsText(file, encoding)

        }
        catch (readError) {

            reject(new Error(`启动文件读取失败: ${readError instanceof Error ? readError.message : "未知错误"}`))

        }

    })

}

/** 批量解析 JSON 文件配置选项 */
export interface IParseJsonFilesOptions extends IParseJsonOptions {
    /**
     * 是否在遇到第一个错误时立即失败
     * - `true`: 遇到错误立即抛出异常，停止解析
     * - `false`: 继续解析所有文件，最后返回成功和失败的列表
     *
     * @default true
     */
    failFast?: boolean
}

/** 批量解析结果 */
export interface IParseJsonFilesResult<T> {
    successes: T[]
    failures: { file: File; error: Error }[]
}

/**
 * FUN: 批量解析 JSON 文件
 *
 * @author dyb-dev
 * @date 2025-09-09 12:07:45
 * @template T
 * @param {(FileList | File[])} files 要解析的文件列表
 * @param {IParseJsonFilesOptions} [options={}] 解析配置选项
 * @returns {*}  {(Promise<IParseJsonFilesResult<T> | T[]>)} 如果 `failFast` 为 `false`，返回包含成功和失败列表的对象；否则返回成功解析的对象数组。
 * @throws {Error} 当 `failFast` 为 `true` 且遇到第一个错误时抛出异常
 */
export const parseJsonFiles = async <T = any>(
    files: FileList | File[],
    options: IParseJsonFilesOptions = {}
): Promise<IParseJsonFilesResult<T> | T[]> => {

    if (!files || files.length === 0) {

        throw new Error("文件列表不能为空")

    }

    const { failFast = true, ...parseOptions } = options
    const fileArray = Array.from(files)

    const successes: T[] = []
    const failures: { file: File; error: Error }[] = []

    for (let i = 0; i < fileArray.length; i++) {

        const file = fileArray[i]
        try {

            const progressCallback = parseOptions.onProgress
                ? (progress: number) => {

                    const overallProgress = (i * 100 + progress) / fileArray.length
                    parseOptions.onProgress?.(Math.round(overallProgress))

                }
                : void 0

            const result = await parseJsonFile<T>(file, { ...parseOptions, onProgress: progressCallback })
            successes.push(result)

        }
        catch (error) {

            const err = error instanceof Error ? error : new Error(String(error))
            if (failFast) {

                throw new Error(`解析文件 "${file.name}" 失败: ${err.message}`)

            }
            failures.push({ file, error: err })

        }

    }

    if (!failFast) {

        return { successes, failures }

    }
    return successes

}

/**
 * 验证文件名是否合法
 *
 * @param filename 文件名
 * @returns 是否合法
 */
const validateFilename = (filename: string): boolean => {

    if (!filename || typeof filename !== "string") {

        return false

    }
    // Windows 和 Unix 系统不允许的字符
    const invalidChars = /[/\\?%*:|"<>]/
    // Windows 保留名称
    const reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i

    if (invalidChars.test(filename)) {

        return false

    }
    if (reservedNames.test(filename.replace(/\.[^.]*$/, ""))) {

        return false

    }
    // 文件名不能以点或空格开始/结束
    if (/^[.\s]|[.\s]$/.test(filename)) {

        return false

    }
    // 长度限制（大多数系统限制为255字符）
    if (filename.length > 255) {

        return false

    }
    return true

}

/**
 * 清理文件名，移除或替换非法字符
 *
 * @param filename 原始文件名
 * @returns 清理后的文件名
 */
const sanitizeFilename = (filename: string): string => {

    if (!filename || typeof filename !== "string") {

        return "untitled"

    }
    const cleaned = filename
        .replace(/[/\\?%*:|"<>]/g, "-") // 替换非法字符为破折号
        .replace(/^[.\s]+|[.\s]+$/g, "") // 移除开头结尾的点和空格
        .substring(0, 250) // 限制长度，留空间给扩展名

    // 如果清理后为空字符串，使用默认名称
    return cleaned || "untitled"

}

/**
 * 检查文件的 MIME 类型是否为 JSON
 *
 * @param file 文件对象
 * @param strictCheck 是否严格检查
 * @returns 是否为有效的 JSON 文件
 */
const isValidJsonFile = (file: File, strictCheck = true): boolean => {

    if (!file?.name) {

        return false

    }
    const validMimeTypes = ["application/json", "text/json", "application/x-json"]
    const validExtensions = [".json", ".JSON"]

    if (strictCheck) {

        return validMimeTypes.includes(file.type) || validExtensions.some(ext => file.name.endsWith(ext))

    }
    return file.type.includes("json") || validExtensions.some(ext => file.name.endsWith(ext))

}

/**
 * 计算文件读取进度
 *
 * @param loaded 已加载字节数
 * @param total 总字节数
 * @returns 进度百分比（0-100）
 */
const calculateProgress = (loaded: number, total: number): number => {

    // 空文件或无效数值被认为是100%完成
    if (total === 0 || !isFinite(total) || !isFinite(loaded)) {

        return 100

    }
    const progress = loaded / total * 100
    // 确保进度在 0-100 之间
    return Math.min(100, Math.max(0, Math.round(progress)))

}

/**
 * 检查浏览器是否支持流式 API
 *
 * @returns 是否支持流式读取
 */
const isStreamingSupported = (): boolean => {

    return typeof ReadableStream !== "undefined" && typeof TextDecoder !== "undefined" && "stream" in File.prototype

}
