import { Column, Grid } from '@components/elements/grid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useCalendar } from '@hooks/use-calendar'
import { useIsMobile } from '@hooks/use-window-size'
import { Col, Row } from '@components/elements-v2/grid'
import { Text } from '@components/elements-v2/text'
import { Card } from "@components/elements-v2/card"


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
    alt='calendar'
    />
  )
  const CardTitle = () => {
    return (
      <Row align='center' gutter='md'>
        <Col>
          {calendarIcon}
        </Col>
        <Col>
          <Text size='lg' color='dark-blue' weight='bold'>
            {i18n.t('vote.calendar_title')}
          </Text>
        </Col>
      </Row>
    )
  }
  return (
    <Card padding="sm" variant="gray">
      <Row gutter={isMobile ? 'md' : 'lg'}>
        <Col xs={12}>
          <CardTitle />
        </Col>
        <Col xs={6}>
          <Label size="xs" color='dark-gray' weight='bold'>
            {i18n.t('vote.calendar_start_label')}:
          </Label>
          <Text size='md' color='dark-blue'>
            {props.startDate && toCalendarFormat(props.startDate)}
          </Text>
        </Col>
        <Col xs={6}>
          <Label size="xs" color='dark-gray' weight='bold'>
            {i18n.t('vote.calendar_end_label')}:
          </Label>
          <Text size='md' color='dark-blue'>
            {props.endDate && toCalendarFormat(props.endDate)}
          </Text>
        </Col>
      </Row>
    </Card>
  )
}

const Label = styled(Text)`
  margin-bottom: 4px;
`
