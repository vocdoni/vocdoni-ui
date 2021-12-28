import moment from 'moment'
import { useTranslation } from 'react-i18next'

export interface IUseCalendar {
  toCalendarFormat: (date: Date) => string
}

export const useCalendar = (): IUseCalendar => {
  const { i18n } = useTranslation()
  const toCalendarFormat = (date: Date) => {
    let momentDate = moment(date).locale('es').format("MMM DD - YYYY (hh:mm)")
    return momentDate.charAt(0).toUpperCase() + momentDate.slice(1)
  }
  return {
    toCalendarFormat
  }
}
