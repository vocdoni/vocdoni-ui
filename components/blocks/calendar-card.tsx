import { Column, Grid } from '@components/elements/grid'
import { useTranslation } from 'react-i18next'
import { Card } from './card'
import styled from 'styled-components'
import { colors } from '@theme/colors'
import { useCalendar } from '@hooks/use-date'
import { useIsMobile } from '@hooks/use-window-size'


type ICalendarCardProps = {
  startDate: Date,
  endDate: Date
}

export const CalendarCard = (props: ICalendarCardProps) => {
  const { i18n } = useTranslation()
  const { toCalendarFormat } = useCalendar()
  const isMobile = useIsMobile()
  const calendarIcon = (
    <img
      src="/images/vote/calendar.svg"
      // alt={i18n.t('vote.calendar_image_alt')}
    />
  )
  return (
    <Card icon={calendarIcon} title={i18n.t('vote.calendar_title')} matchHeight>
      <Grid noGutter>
        <Column noGutter sm={6}>
          <Label isMobile={isMobile}>
            {i18n.t('vote.calendar_start_label')}:
          </Label>
          <Text>
            {props.startDate ? toCalendarFormat(props.startDate) : '...'}
          </Text>
        </Column>
        <Column noGutter sm={6}>
          <Label isMobile={isMobile}>
            {i18n.t('vote.calendar_end_label')}:
          </Label>
          <Text>
            {props.endDate ? toCalendarFormat(props.endDate) : '...'}
          </Text>
        </Column>
      </Grid>
    </Card>
  )
}

const Label = styled.div<{isMobile?:boolean}>`
  color: ${colors.lightText};
  font-size: 14px;
  font-weight: 600;
  font-family: Manrope;
  margin-bottom: 4px;
  margin-top: ${({isMobile})=> isMobile? '16px': '24px'};
`
const Text = styled.span`
  color: ${colors.blueText};
  font-size: 18px;
  font-weight: 400;
  font-family: Manrope;
`
