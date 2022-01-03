import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoteStatus } from '@lib/util'
import { Tag } from '../elements-v2/tag'
import { useCalendar } from '@hooks/use-calendar'

interface IProcessStatusLabelV2Props {
  status: VoteStatus
  startDate: Date,
  endDate: Date
}

export const ProcessStatusLabelV2 = (props: IProcessStatusLabelV2Props) => {
  const { i18n } = useTranslation()
  const { getDateDiff } = useCalendar()
  const startingIn = getDateDiff(null, props.startDate, 'diff')
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
  switch (props.status) {
    case VoteStatus.Active:
      return (
        <Tag variant='success' label={getDateDiff(null, props.endDate, 'countdownV2').value}>
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
