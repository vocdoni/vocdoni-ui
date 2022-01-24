import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { VoteStatus } from '@lib/util'
import { Tag } from '../elements-v2/tag'
import { useCalendar } from '@hooks/use-calendar'
import { useUrlHash } from 'use-url-hash'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useProcessInfo } from '@hooks/use-process-info'

export const ProcessStatusLabel = () => {
  const { i18n } = useTranslation()
  const { getDateDiffString, getDateDiff } = useCalendar()
  const processId = useUrlHash().slice(1)
  const { status, endDate, startDate } = useProcessInfo(processId)
  const [now, setNow] = useState(new Date)
  useEffect(() => {
    setInterval(() => {
      setNow(new Date)
    }, 1000)
  }, [])
  const startingString = getDateDiffString(now, startDate, true)

  switch (status) {
    case VoteStatus.Active:
      return (
        <Tag variant='success' label={getDateDiff(now, endDate, 'countdownV2').value}>
          {i18n.t('vote.active_vote')}
        </Tag>
      )

    case VoteStatus.Upcoming:
      return (
        <Tag variant='neutral'>

          {i18n.t('vote.starting_in') + ' ' + startingString}
        </Tag>
      )

    case VoteStatus.Ended:
      return <Tag variant='warning'>{i18n.t('vote.ended_vote')}</Tag>

    case VoteStatus.Paused:
      return <Tag variant='info'>{i18n.t('vote.paused_vote')}</Tag>

    case VoteStatus.Canceled:
      return <Tag variant='error'>{i18n.t('vote.canceled_vote')}</Tag>

    default:
      return <></>
  }

}
