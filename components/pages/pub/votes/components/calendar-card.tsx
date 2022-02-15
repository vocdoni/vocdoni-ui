import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useIsMobile } from '@hooks/use-window-size'
import { Col, Row } from '@components/elements-v2/grid'
import { Text } from '@components/elements-v2/text'
import { Card } from "@components/elements-v2/card"
import { CalendarIcon } from '@components/elements-v2/icons'
import moment from 'moment'

interface CalendarCardProps {
  startDate: Date,
  endDate: Date
}

export const CalendarCard = (props: CalendarCardProps) => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile()
  const toCalendarFormat = (date: Date) => {
    let momentDate = moment(date).locale('es').format("MMM DD - YYYY (HH:mm)")
    return momentDate.charAt(0).toUpperCase() + momentDate.slice(1)
  }
  return (
    <Card padding="sm" variant="gray">
      <Row gutter={isMobile ? 'md' : 'lg'}>
        <Col xs={12}>
          {/* <CardTitle /> */}
          <Row align='center' gutter='md'>
            <Col>
              <CalendarIcon size={24} />
            </Col>
            <Col>
              <Text size='lg' color='dark-blue' weight='regular'>
                {i18n.t('vote.calendar_title')}
              </Text>
            </Col>
          </Row>
        </Col>
        {/* CARD CONTENT */}
        <Col xs={6}>
          <Label size="xs" color='dark-gray' weight='bold'>
            {i18n.t('vote.calendar_start_label')}:
          </Label>
          <Text size='sm' color='dark-blue'>
            {props.startDate && toCalendarFormat(props.startDate)}
          </Text>
        </Col>
        <Col xs={6}>
          <Label size="xs" color='dark-gray' weight='bold'>
            {i18n.t('vote.calendar_end_label')}:
          </Label>
          <Text size='sm' color='dark-blue'>
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
