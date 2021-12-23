import moment from 'moment'
import { useTranslation } from 'react-i18next'

export interface IUseCalendar {
  toCalendarFormat: (date: Date) => string
}

export const useCalendar = (): IUseCalendar => {
  const { i18n } = useTranslation()
  const toCalendarFormat = (date: Date) => {
    return moment(date).locale(i18n.language).format("MMM DD - YYYY (hh:mm)")
  }
  return {
    toCalendarFormat
  }
}
