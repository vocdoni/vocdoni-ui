import { GatewayPool, VotingApi } from "dvote-js"
import i18n from "../i18n"
import { ProcessInfo } from "./types"

export enum DateDiffType {
  Start = 'start-date',
  End = 'end-date'
}

export const getDaysUntilEnd = async (
  process: ProcessInfo,
  pool: GatewayPool
): Promise<string> => {
  const endDate = await VotingApi.estimateDateAtBlock(
    process.parameters.startBlock + process.parameters.blockCount,
    pool
  )
  return localizedStrDateDiff(DateDiffType.End, endDate)
}

export function localizedStrDateDiff(type: DateDiffType, target: Date): string {
  if (!target) return ''
  let diff = (target.getTime() - Date.now()) / 1000

  if (diff > 3) return strDiffFuture(type, diff)
  else if (diff < -3) return strDiffPast(type, -diff)
  else if (type == DateDiffType.Start) return i18n.t("dates.starting_right_now")
  return i18n.t("dates.ending_right_now")
}

// Helpers

function strDiffFuture(type: DateDiffType, secondDiff: number): string {
  let num: number

  if (secondDiff > 60 * 60 * 24) {
    // days
    num = Math.floor(secondDiff / 60 / 60 / 24)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_in_n_days", { interpolation: { num } })
      return i18n.t("dates.ending_in_n_days", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_tomorrow")
      return i18n.t("dates.ending_tomorrow")
    }
  } else if (secondDiff > 60 * 60) {
    // hours
    num = Math.floor(secondDiff / 60 / 60)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_in_n_hours", { interpolation: { num } })
      return i18n.t("dates.ending_in_n_hours", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_in_one_hour")
      return i18n.t("dates.ending_in_one_hour")
    }
  } else if (secondDiff > 60) {
    // minutes
    num = Math.floor(secondDiff / 60)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_in_n_minutes", { interpolation: { num } })
      return i18n.t("dates.ending_in_n_minutes", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_in_one_minute")
      return i18n.t("dates.ending_in_one_minute")
    }
  } else {
    // seconds
    num = Math.floor(secondDiff)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_in_n_seconds", { interpolation: { num } })
      return i18n.t("dates.ending_in_n_seconds", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.starting_right_now")
      return i18n.t("dates.ending_right_now")
    }
  }
}

function strDiffPast(type: DateDiffType, secondDiff: number): string {
  let num: number

  if (secondDiff > 60 * 60 * 24) {
    // days
    num = Math.floor(secondDiff / 60 / 60 / 24)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.started_n_days_ago", { interpolation: { num } })
      return i18n.t("dates.ended_n_days_ago", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.started_yesterday")
      return i18n.t("dates.ended_yesterday")
    }
  } else if (secondDiff > 60 * 60) {
    // hours
    num = Math.floor(secondDiff / 60 / 60)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.started_n_hours_ago", { interpolation: { num } })
      return i18n.t("dates.ended_n_hours_ago", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.started_an_hour_ago")
      return i18n.t("dates.ended_an_hour_ago")
    }
  } else if (secondDiff > 60) {
    // minutes
    num = Math.floor(secondDiff / 60)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.started_n_minutes_ago", { interpolation: { num } })
      return i18n.t("dates.ended_n_minutes_ago", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.started_a_minute_ago")
      return i18n.t("dates.ended_a_minute_ago")
    }
  } else {
    // seconds
    num = Math.floor(secondDiff)

    if (num > 1) {
      if (type == DateDiffType.Start) return i18n.t("dates.started_n_seconds_ago", { interpolation: { num } })
      return i18n.t("dates.ended_n_seconds_ago", { interpolation: { num } })
    }
    else {
      if (type == DateDiffType.Start) return i18n.t("dates.started_right_now")
      return i18n.t("dates.ended_right_now")
    }
  }
}
