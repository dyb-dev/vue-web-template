/*
 * @Author: dyb-dev
 * @Date: 2024-06-01 14:36:15
 * @LastEditors: dyb-dev
 * @LastEditTime: 2025-02-19 15:56:56
 * @FilePath: /web-mobile-template/src/utils/dateTime/index.ts
 * @Description: 日期时间相关工具函数
 */

import dayjs from "dayjs"

/**
 * FUN: 延迟函数
 *
 * @author dyb-dev
 * @date 19/02/2025/  15:55:58
 * @param {number} ms - 延迟时间（毫秒）
 * @returns {*}  {Promise<void>} - 返回一个 Promise 对象
 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 时间段对象，包含开始时间和结束时间 */
interface ITimeInterval {
    /** 开始时间 */
    start: string
    /** 结束时间 */
    end: string
}

/** 时间映射对象，键为日期字符串，值为包含多个时间段的数组 */
interface ITimeMapping {
    [date: string]: ITimeInterval[]
}

/** 获取指定日期范围内未包含的时间段函数的参数对象 */
interface IGetUnscheduledTimeParams {
    /** 开始日期 */
    startDate: string
    /** 结束日期 */
    endDate: string
    /** 包含时间段的映射 */
    scheduledTimeMap: ITimeMapping
    /** 每天的开始时间（可选） */
    startOfDay?: string
    /** 每天的结束时间（可选） */
    endOfDay?: string
}

/**
 * FUN: 获取指定日期范围内未包含的时间段。
 *
 * @author dyb-dev
 * @date 01/06/2024/  14:53:17
 * @export
 * @param {IGetUnscheduledTimeParams} params - 参数对象
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @param {ITimeMapping} params.scheduledTimeMap - 包含时间段的映射
 * @param {string} [params.startOfDay="00:00:00"] - 每天的开始时间，默认值为 "00:00:00"（可选）
 * @param {string} [params.endOfDay="24:00:00"] - 每天的结束时间，默认值为 "24:00:00"（可选）
 * @returns {ITimeMapping} 包含每一天未排班时间段的对象
 */
const getUnscheduledTimeInDateRange = ({
    startDate,
    endDate,
    scheduledTimeMap,
    startOfDay = "00:00:00",
    endOfDay = "24:00:00"
}: IGetUnscheduledTimeParams): ITimeMapping => {

    /** 未包含时间段的映射对象 */
    const _unscheduledTimeMap: ITimeMapping = {}
    /** 当前日期 */
    let _currentDate = dayjs(startDate)

    // 遍历从 startDate 到 endDate 的每一天
    while (_currentDate.isBefore(dayjs(endDate))) {

        const _currentDateStr = _currentDate.format("YYYY-MM-DD")

        // 日期范围内如果某个日期没有对应的key
        if (!scheduledTimeMap[_currentDateStr]) {

            _unscheduledTimeMap[_currentDateStr] = [
                {
                    start: `${_currentDateStr} ${startOfDay}`,
                    end: `${_currentDateStr} ${endOfDay}`
                }
            ]

        }
        else {

            /** 包含时间段列表 */
            let _scheduledTimeList = scheduledTimeMap[_currentDateStr]
            // 调整包含时间段列表顺序（升序）
            _scheduledTimeList = _scheduledTimeList.sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
            // 调整包含时间段列表重叠部分（交集）
            _scheduledTimeList = resolveOverlappingIntervals(_scheduledTimeList)

            /** 未包含时间段列表 */
            const _unscheduledIntervals: ITimeInterval[] = []
            let _currentTime = dayjs(`${_currentDateStr} ${startOfDay}`)

            // 计算未包含时间
            for (const scheduledTimeIntervals of _scheduledTimeList) {

                /** 包含时间段的开始时间 */
                const _scheduledTimeIntervalsStart = dayjs(scheduledTimeIntervals.start)

                // 当前时间在事件开始时间之前
                if (_currentTime.isBefore(_scheduledTimeIntervalsStart)) {

                    _unscheduledIntervals.push({
                        start: _currentTime.format("YYYY-MM-DD HH:mm:ss"),
                        end: _scheduledTimeIntervalsStart.format("YYYY-MM-DD HH:mm:ss")
                    })

                }
                _currentTime = dayjs(scheduledTimeIntervals.end)

            }

            const _endOfDayTime = dayjs(`${_currentDateStr} ${endOfDay}`)
            // 是否当前时间在当天结束时间之前
            if (_currentTime.isBefore(_endOfDayTime)) {

                _unscheduledIntervals.push({
                    start: _currentTime.format("YYYY-MM-DD HH:mm:ss"),
                    end: _endOfDayTime.format("YYYY-MM-DD HH:mm:ss")
                })

            }

            _unscheduledTimeMap[_currentDateStr] = _unscheduledIntervals

        }

        _currentDate = _currentDate.add(1, "day")

    }
    return _unscheduledTimeMap

}

/**
 * FUN: 处理时间段重叠。
 *
 * @author dyb-dev
 * @date 01/06/2024/  14:54:02
 * @export
 * @param {ITimeInterval[]} eventIntervals - 多个时间段的数组列表。
 * @returns {*}  {ITimeInterval[]}
 */
const resolveOverlappingIntervals = (eventIntervals: ITimeInterval[]): ITimeInterval[] => {

    /** 多个时间段的数组列表 */
    const _adjustedIntervals: ITimeInterval[] = []

    for (let i = 0; i < eventIntervals.length; i++) {

        /** 当前时间段 */
        const _currentInterval = eventIntervals[i]
        if (i > 0) {

            const _previousInterval = _adjustedIntervals[i - 1]
            // 检查当前时间段的开始时间是否在前一个时间段的结束时间之前
            if (dayjs(_currentInterval.start).isBefore(_previousInterval.end)) {

                console.warn(
                    `时间含有交集 上一项-结束时间：${_previousInterval.end} 下一项-开始时间：${_currentInterval.start} 调整下一项-开始时间为 ${_previousInterval.end}`
                )
                // 将当前时间段的开始时间调整为前一个时间段的结束时间
                _currentInterval.start = _previousInterval.end

            }

        }

        _adjustedIntervals.push(_currentInterval)

    }
    return _adjustedIntervals

}

/**
 * FUN: 根据给定的时间映射和时间间隔，计算出按照时间间隔划分的多个时间段。
 *
 * @author dyb-dev
 * @date 01/06/2024/  14:52:55
 * @export
 * @param {ITimeMapping} timeMapping - 包含每一天时间段的对象。
 * @param {number} slotDurationMinutes - 时间间隔，单位为分钟。
 * @returns {*}  {ITimeInterval[]}
 */
const generateTimeIntervals = (timeMapping: ITimeMapping, slotDurationMinutes: number): ITimeInterval[] => {

    /** 所有时间段列表 */
    const _allTimeIntervalsList: ITimeInterval[] = []

    for (const date in timeMapping) {

        /** 当天时间段列表 */
        const _times = timeMapping[date]
        _times.forEach(timeSlot => {

            /** 当前开始时间 */
            let _currentStartTime = dayjs(timeSlot.start)
            const _endTime = dayjs(timeSlot.end)

            while (_currentStartTime.isBefore(_endTime)) {

                /** 计算当前时间的分钟单位是否能与当前的时间间隔 slotDuration 实现整除 */
                const _currentMinutes = _currentStartTime.minute()
                /** 下一个分钟数 */
                let _nextSlotMinutes: number

                // 判断能否整除
                if (_currentMinutes % slotDurationMinutes === 0) {

                    _nextSlotMinutes = _currentMinutes + slotDurationMinutes

                }
                else {

                    // 计算当前分钟数和下一个时间间隔点的分钟数
                    _nextSlotMinutes = Math.ceil(_currentMinutes / slotDurationMinutes) * slotDurationMinutes

                }

                /** 当前结束时间 */
                let _currentEndTime = _currentStartTime.minute(_nextSlotMinutes).second(0)

                // 判断如果 currentEndTime 大于 endTime，则 currentEndTime 设置为 endTime
                if (_currentEndTime.isAfter(_endTime)) {

                    _currentEndTime = _endTime

                }

                // 如果时间符合条件则添加时间段
                if (_currentStartTime.isBefore(_currentEndTime)) {

                    _allTimeIntervalsList.push({
                        start: _currentStartTime.format("YYYY-MM-DD HH:mm:ss"),
                        end: _currentEndTime.format("YYYY-MM-DD HH:mm:ss")
                    })

                    _currentStartTime = _currentEndTime

                }
                else {

                    break

                }

            }

        })

    }

    return _allTimeIntervalsList

}

export { delay, getUnscheduledTimeInDateRange, resolveOverlappingIntervals, generateTimeIntervals }
