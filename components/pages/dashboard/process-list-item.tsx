import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useBlockStatus,  SummaryProcess} from '@vocdoni/react-hooks'
import { VotingApi } from 'dvote-js'
import { useTranslation } from 'react-i18next'

import { DateDiffType, localizedStrDateDiff } from '@lib/date'
import { VoteStatus } from '@lib/util'
import { IProcessesSummary } from '@lib/types'


import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { Image } from '@components/elements/image'
import { ImageContainer } from '@components/elements/images'

import { VoteListItem } from '../../blocks/list-items'
import moment from 'moment'

interface IDashboardProcessListItemProps {
  process: SummaryProcess
  status: VoteStatus
  accountName?: string
  entityLogo?: string
}

export const DashboardProcessListItem = ({
  process,
  accountName,
  status,
  entityLogo
}: IDashboardProcessListItemProps) => {
  const { i18n } = useTranslation()

  const [date, setDate] = useState<string>('')
  const { blockStatus } = useBlockStatus()

  useEffect(() => {
    let startDate

    switch (status) {
      case VoteStatus.Active:
        const endDate = VotingApi.estimateDateAtBlockSync(
          process?.summary?.endBlock,
          blockStatus
        )
        const timeLeft = localizedStrDateDiff(DateDiffType.End, endDate)
        setDate(timeLeft)
        break

      case VoteStatus.Ended:
        setDate(i18n.t('dashboard.process_ended'))
        break

      case VoteStatus.Paused:
        startDate = VotingApi.estimateDateAtBlockSync(
          process?.summary?.startBlock,
          blockStatus
        )

        if (!moment(startDate).isAfter(moment.now())) {
          setDate(i18n.t('dashboard.process_paused'))
          break
        }

      case VoteStatus.Upcoming:
        startDate = VotingApi.estimateDateAtBlockSync(
          process?.summary?.startBlock,
          blockStatus
        )

        const timetoStart = localizedStrDateDiff(DateDiffType.Start, startDate)

        setDate(timetoStart)
        status = VoteStatus.Upcoming
        break
    }
  }, [blockStatus])

  return (
    <VoteItemWrapper>
      <VoteListItem
        icon={
          <ImageContainer width="30px" height="30px">
            <Image src={entityLogo || FALLBACK_ACCOUNT_ICON} />
          </ImageContainer>
        }
        description={process?.metadata?.description.default}
        title={process?.metadata?.title.default}
        processId={process?.id}
        entityName={accountName}
        dateText={date}
        status={status}
      />
    </VoteItemWrapper>
  )
}

const VoteItemWrapper = styled.div`
  margin-bottom: 10px;
`
