import moment from 'moment'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type dateDiffReturn = {
  value: string
  format?: 'days' | 'hours' | 'minutes' | 'seconds' | 'hh:mm:ss' | 'ddd hhh mmm sss'
}

export interface IUseCalendar {
  toCalendarFormat: (date: Date) => string
  getDateDiff: (startDate?: Date, endDate?: Date, format?: DateDiffFormat) => dateDiffReturn
  getDateDiffString: (startDate?: Date, endDate?: Date, disableCountdown?: boolean) => string
}
export type DateDiffFormat = 'diff' | 'days' | 'hours' | 'minutes' | 'seconds' | 'countdown' | 'countdownV2' | 'startingIn' | 'endingIn'
export const useCalendar = (): IUseCalendar => {
  const { i18n } = useTranslation()
  const toCalendarFormat = (date: Date) => {
    let momentDate = moment(date).locale('es').format("MMM DD - YYYY (hh:mm)")
    return momentDate.charAt(0).toUpperCase() + momentDate.slice(1)
  }
  const getDateDiff = (startDate?: Date, endDate?: Date, format?: DateDiffFormat): dateDiffReturn => {
    let start, end
    if (!endDate) {
      end = moment(Date.now())
    } else {
      end = endDate
    }
    if (!startDate) {
      start = moment(Date.now())
    } else {
      start = startDate
    }
    const diffTime = end - start
    const duration = moment.duration(diffTime, 'milliseconds');
    const dayDiff = Math.floor(duration.asDays())
    const hourDiff = Math.floor(duration.asHours())
    const minDiff = Math.floor(duration.asMinutes())
    const secDiff = Math.floor(duration.asSeconds())
    switch (format) {
      case 'days':
        return { value: dayDiff.toString(), format: 'days' }
      case 'hours':
        return { value: hourDiff.toString(), format: 'hours' }
      case 'minutes':
        return { value: minDiff.toString(), format: 'minutes' }
      case 'seconds':
        return { value: secDiff.toString(), format: 'seconds' }
      case 'countdown':
        let hh = hourDiff.toString()
        if (hourDiff < 10) {
          hh = '0' + hh
        }
        let mmss = moment.utc(duration.asMilliseconds()).format("mm:ss")
        return { value: hh + ':' + mmss, format: 'hh:mm:ss' }
      case 'countdownV2':
        let dateString = ''
        if (dayDiff !== 0) {
          dateString = dateString + dayDiff + 'd '
        }
        if (hourDiff !== 0) {
          dateString = dateString + moment.utc(duration.asMilliseconds()).format("HH") + 'h '
        }
        if (minDiff !== 0) {
          dateString = dateString + moment.utc(duration.asMilliseconds()).format("mm") + 'm '
        }
        if (secDiff !== 0) {
          dateString = dateString + moment.utc(duration.asMilliseconds()).format("ss") + 's '
        }
        return { value: dateString, format: 'ddd hhh mmm sss' }
      case 'diff':
        if (dayDiff < 2 && hourDiff > 0) {
          return { value: (hourDiff + dayDiff * 24).toString(), format: 'hours' }
        }
        // if diffrence beween 60 and 1 minute
        else if (hourDiff === 0 && minDiff > 0) {
          return { value: minDiff.toString(), format: 'minutes' }
        }
        // if diffrence is less than 1 minute
        else if (minDiff === 0) {
          return { value: secDiff.toString(), format: 'seconds' }
        } else {
          // else
          return { value: dayDiff.toString(), format: 'days' }
        }
      default:
        return { value: dayDiff.toString(), format: 'days' }
    }

  }
  const getDateDiffString = (startDate?: Date, endDate?: Date, disableCountdown?: boolean): string => {
    let diff = getDateDiff(startDate, endDate, 'diff')
    let string
    if (!disableCountdown) {
      switch (diff.format) {
        case 'days':
          string = i18n.t("vote.value_days", { value: diff.value })
          break
        default:
          string = getDateDiff(null, endDate, 'countdown').value + 's'
      }
    } else {
      switch (diff.format) {
        case 'days':
          string = i18n.t("vote.value_days", { value: diff.value })
          break
        case 'hours':
          string = i18n.t("vote.value_hours", { value: diff.value })
          break
        case 'minutes':
          string = i18n.t("vote.value_minutes", { value: diff.value })
          break
        case 'seconds':
          string = i18n.t("vote.value_seconds", { value: diff.value })
          break
        default:
          string = i18n.t("vote.value_days", { value: diff.value })
      }
    }
    return string
  }
  return {
    toCalendarFormat,
    getDateDiff,
    getDateDiffString
  }
}
