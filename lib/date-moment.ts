import i18n from '@i18n'
import moment from 'moment'
export enum DateDiffType {
  Start = 'start-date',
  End = 'end-date',
  Countdown = 'countdown',
  CountdownV2 = 'countdown-v2'
}
export const dateDiffStr = (type: DateDiffType, target: Date): string => {
  if (!target) return ''
  let diff = (target.getTime() - Date.now()) / 1000
  // if is leess than 3s and type countdown
  if (diff > 3 && (type === DateDiffType.Countdown)) return strDiffCountdown(type, diff)
  if (diff > 3 && (type === DateDiffType.CountdownV2)) return strDiffCountdownV2(type, diff)
  // if type is start or end date and more than 3 secs
  if (diff > 3) return strDiff(diff)
  else if (diff < -3) return strDiff(-diff)
  // show message
  else if (type !== DateDiffType.End) return i18n.t('dates.starting_right_now')
  return i18n.t('dates.ending_right_now')

}

const strDiffCountdown = (type: DateDiffType, secondDiff: number): string => {
  // Grater than 2 days return string
  if (secondDiff > 60 * 60 * 24 * 2) {
    if (secondDiff > 3) return strDiff(secondDiff)
    else if (secondDiff < -3) return strDiff(-secondDiff)
  }
  const duration = moment.duration(secondDiff, 'seconds')
  let hours = duration.hours().toString()
  if (hours.length < 2) {
    hours = `0${hours}`
  }
  let mins = duration.minutes().toString()
  if (mins.length < 2) {
    mins = `0${mins}`
  }
  let secs = duration.seconds().toString()
  if (secs.length < 2) {
    secs = `0${secs}`
  }
  return `${hours}:${mins}:${secs}`
}
const strDiffCountdownV2 = (type: DateDiffType, secondDiff: number): string => {
  // Grater than 2 days return string
  if (secondDiff > 60 * 60 * 24 * 2) {
    if (secondDiff > 3) return strDiff(secondDiff)
    else if (secondDiff < -3) return strDiff(-secondDiff)
  }
  const duration = moment.duration(secondDiff, 'seconds')
  let string = ''
  let days = duration.days()
  if (days > 0) {
    string = `${string} ${days}d`
  }
  let hours = duration.hours()
  if (hours > 0) {
    string = `${string} ${hours}h`
  }
  let mins = duration.minutes()
  if (mins > 0) {
    string = `${string} ${mins}m`
  }
  let secs = duration.seconds()
  if (secs > 0) {
    string = `${string} ${secs}s`
  }
  return string
}

const strDiff = (secondDiff: number): string => {
  const duration = moment.duration(secondDiff, 'seconds')
  if (duration.asDays() > 0) {
    return i18n.t('dates.days', { num: Math.floor(duration.asDays()) })
  }
  if (duration.asHours() > 0) {
    return i18n.t('dates.hours', { num: Math.floor(duration.asHours()) })
  }
  if (duration.asMinutes() > 0) {
    return i18n.t('dates.minutes', { num: Math.floor(duration.asMinutes()) })
  }
  if (duration.asSeconds() > 0) {
    return i18n.t('dates.seconds', { num: Math.floor(duration.asSeconds()) })
  }
}
