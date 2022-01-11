import { Column, Grid } from '@components/elements/grid'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useCalendar } from '@hooks/use-calendar'
import { useIsMobile } from '@hooks/use-window-size'
import { Col, Row } from '@components/elements-v2/grid'
import { Text } from '@components/elements-v2/text'
import { Card } from "@components/elements-v2/card"
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from 'use-url-hash'
import { useProcess, useDateAtBlock } from '@vocdoni/react-hooks'
import { useProcessInfo } from '@hooks/use-process-info'
import { CalendarIcon } from '@components/elements-v2/icons'



export const CalendarCard = () => {
  const { i18n } = useTranslation()
  const { toCalendarFormat } = useCalendar()
  const processId = useUrlHash().slice(1)
  const { endDate, startDate } = useProcessInfo(processId)
  const isMobile = useIsMobile()
  return (
    <Card padding="sm" variant="gray">
      <Row gutter={isMobile ? 'md' : 'lg'}>
        <Col xs={12}>
          {/* <CardTitle /> */}
          <Row align='center' gutter='md'>
            <Col>
              <CalendarIcon />
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
          <Text size='md' color='dark-blue'>
            {startDate && toCalendarFormat(startDate)}
          </Text>
        </Col>
        <Col xs={6}>
          <Label size="xs" color='dark-gray' weight='bold'>
            {i18n.t('vote.calendar_end_label')}:
          </Label>
          <Text size='md' color='dark-blue'>
            {endDate && toCalendarFormat(endDate)}
          </Text>
        </Col>
      </Row>
    </Card>
  )
}

const Label = styled(Text)`
  margin-bottom: 4px;
`
