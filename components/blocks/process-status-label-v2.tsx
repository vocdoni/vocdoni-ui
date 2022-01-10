import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoteStatus } from '@lib/util'
import { Tag } from '../elements-v2/tag'
import { useCalendar } from '@hooks/use-calendar'
import { useUrlHash } from 'use-url-hash'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useProcessInfo } from '@hooks/use-process-info'

export const ProcessStatusLabelV2 = () => {
  const { i18n } = useTranslation()
  const { getDateDiff } = useCalendar()
  const processId = useUrlHash().slice(1)
  const { status, endDate, startDate } = useProcessInfo(processId)
  const startingIn = getDateDiff(null, startDate, 'diff')
  let startingString
  switch (startingIn.format) {
    case 'days':
      startingString = i18n.t("vote.value_days", { value: startingIn.value })
      break
    case 'hours':
      startingString = i18n.t("vote.value_hours", { value: startingIn.value })
      break
    case 'minutes':
      startingString = i18n.t("vote.value_minutes", { value: startingIn.value })
      break
    case 'seconds':
      startingString = i18n.t("vote.value_seconds", { value: startingIn.value })
      break
    default:
      startingString = i18n.t("vote.value_days", { value: startingIn.value })
  }
  switch (status) {
    case VoteStatus.Active:
      return (
        <Tag variant='success' label={getDateDiff(null, endDate, 'countdownV2').value}>
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
      return <Tag variant='info'>{i18n.t('vote.ended_vote')}</Tag>

    case VoteStatus.Paused:
      return <Tag variant='info'>{i18n.t('vote.paused_vote')}</Tag>

    case VoteStatus.Canceled:
      return <Tag variant='error'>{i18n.t('vote.canceled_vote')}</Tag>

    default:
      return <></>
  }

}
