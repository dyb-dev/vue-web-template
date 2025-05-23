/*
 * @Author: dyb-dev
 * @Date: 2024-06-01 15:33:40
 * @LastEditors: dyb-dev
 * @LastEditTime: 2024-10-15 22:53:55
 * @FilePath: /vue-web-template/src/utils/storage/index.ts
 * @Description: 缓存相关工具函数
 */

/** 可以序列化的对象 */
interface ISerializableObject {
    [key: string]: TSerializable
}

/** 可以序列化的类型 */
type TSerializable = TPrimitive | Array<TSerializable> | ISerializableObject

/**
 * FUN: 设置本地缓存
 *
 * @author dyb-dev
 * @date 09/01/2024/  11:16:11
 * @param {string} key 存储key
 * @param {TSerializable} value 存储数据
 * @param {(number | null)} [expiry=null] 过期时间
 */
const setLocalStorage = <T extends TSerializable = TSerializable>(key: string, value: T, expiry?: number) => {

    localStorage.setItem(
        key,
        JSON.stringify({
            data: value,
            expiry: expiry ?? null
        })
    )

}

/**
 * FUN: 获取本地缓存
 *
 * @author dyb-dev
 * @date 15/10/2024/  14:03:03
 * @template T 可序列化类型
 * @param {string} key 存储key
 * @returns {*}  {(T | void)} 存储数据
 */
const getLocalStorage = <T extends TSerializable = TSerializable>(key: string): T | void => {

    const _value = localStorage.getItem(key)

    if (_value) {

        const _parsed = JSON.parse(_value)
        if (!_parsed.expiry || _parsed.expiry > Date.now()) {

            return _parsed.data

        }
        deleteLocalStorage(key)

    }

}

/**
 * FUN: 删除指定 `key` 的本地缓存
 *
 * @author dyb-dev
 * @date 09/01/2024/  11:20:17
 * @param {string} key 存储key
 */
const deleteLocalStorage = (key: string) => {

    localStorage.removeItem(key)

}

/**
 * FUN: 清空本地缓存
 *
 * @author dyb-dev
 * @date 15/10/2024/  13:57:54
 */
const clearLocalStorage = () => {

    localStorage.clear()

}

/**
 * FUN: 设置会话缓存
 *
 * @author dyb-dev
 * @date 09/01/2024/  11:16:55
 * @param {string} key 存储key
 * @param {TSerializable} value 存储数据
 * @param {(number | null)} [expiry=null] 过期时间
 */
const setSessionStorage = <T extends TSerializable = TSerializable>(key: string, value: T, expiry?: number) => {

    sessionStorage.setItem(
        key,
        JSON.stringify({
            data: value,
            expiry: expiry ?? null
        })
    )

}

/**
 * FUN: 获取会话缓存
 *
 * @author dyb-dev
 * @date 15/10/2024/  14:09:18
 * @template T 可序列化类型
 * @param {string} key 存储key
 * @returns {*}  {(T | void)} 存储数据
 */
const getSessionStorage = <T extends TSerializable = TSerializable>(key: string): T | void => {

    const _value = sessionStorage.getItem(key)

    if (_value) {

        const _parsed = JSON.parse(_value)
        if (!_parsed.expiry || _parsed.expiry > Date.now()) {

            return _parsed.data

        }
        deleteSessionStorage(key)

    }

}

/**
 * FUN: 删除指定 `key` 的会话缓存
 *
 * @author dyb-dev
 * @date 09/01/2024/  11:20:24
 * @param {string} key 存储key
 */
const deleteSessionStorage = (key: string) => {

    sessionStorage.removeItem(key)

}

/**
 * FUN: 清空会话缓存
 *
 * @author dyb-dev
 * @date 15/10/2024/  13:57:54
 */
const clearSessionStorage = () => {

    sessionStorage.clear()

}

/**
 * FUN: 清空所有缓存
 *
 * @author dyb-dev
 * @date 27/01/2024/  14:58:21
 */
const clearAllStorage = () => {

    localStorage.clear()
    sessionStorage.clear()

}

export type { ISerializableObject, TSerializable }

export {
    setLocalStorage,
    setSessionStorage,
    getLocalStorage,
    getSessionStorage,
    deleteLocalStorage,
    deleteSessionStorage,
    clearLocalStorage,
    clearSessionStorage,
    clearAllStorage
}
