import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { dateDiffStr, DateDiffType } from '@lib/date-moment'
import { VoteStatus } from '@lib/util'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useUrlHash } from 'use-url-hash'
import { Tag } from '../elements-v2/tag'

export const ProcessStatusLabel = () => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const { status, endDate, startDate, archived } = useProcessWrapper(processId)
  const endingInDiffString = dateDiffStr(DateDiffType.CountdownV2, endDate)
  const startingInDiffString = dateDiffStr(DateDiffType.CountdownV2, startDate)
  const tags = []
  switch (status) {
    case VoteStatus.Active:
      tags.push(
        <Tag
          variant='success'
          key='active'
          label={i18n.t('vote.ending_in') + ' ' + endingInDiffString}>
          {i18n.t('vote.active_vote')}
        </Tag>
      )
    break

    case VoteStatus.Upcoming:
      tags.push(
        <Tag variant='neutral' key='upcoming'>
          {i18n.t('vote.starting_in')} {startingInDiffString}
        </Tag>
      )
    break

    case VoteStatus.Ended:
      tags.push(
        <Tag variant='warning' key='ended'>{i18n.t('vote.ended_vote')}</Tag>
      )
    break

    case VoteStatus.Paused:
      tags.push(
        <Tag variant='info' key='paused'>{i18n.t('vote.paused_vote')}</Tag>
      )
    break

    case VoteStatus.Canceled:
      tags.push(
        <Tag variant='error' key='canceled'>{i18n.t('vote.canceled_vote')}</Tag>
      )
    break
  }

  if (archived) {
    tags.push(
      <Tag variant='warning' key='archived'>{i18n.t('vote.archived')}</Tag>
    )
  }

  return <TagsGroup>{tags}</TagsGroup>
}

const TagsGroup = styled.div`
  > span + span {
    margin-left: 16px;
  }
`
