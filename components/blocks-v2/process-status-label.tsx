import React from 'react'
import { useTranslation } from 'react-i18next'
import { VoteStatus } from '@lib/util'
import { Tag } from '../elements-v2/tag'
import { useUrlHash } from 'use-url-hash'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { dateDiffStr, DateDiffType } from '@lib/date-moment'

export const ProcessStatusLabel = () => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const { status, endDate, startDate } = useProcessWrapper(processId)
  const endingInDiffString = dateDiffStr(DateDiffType.CountdownV2, endDate)
  const startingInDiffString = dateDiffStr(DateDiffType.CountdownV2, startDate)
  switch (status) {
    case VoteStatus.Active:
      return (
          <Tag
            variant='success'
            label={i18n.t('vote.ending_in') + ' ' + endingInDiffString}
          >
            {i18n.t('vote.active_vote')}
          </Tag>
      )

    case VoteStatus.Upcoming:
      return <Tag variant='warning'>{i18n.t('fcb.upcoming_voting_tag')}</Tag>

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
