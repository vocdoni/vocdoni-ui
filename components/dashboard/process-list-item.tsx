import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { usePool } from '@vocdoni/react-hooks'
import { GatewayPool } from 'dvote-js'

import { ProcessInfo } from '../../lib/types'
import { getRemainingDays } from '../../lib/date'

import { VoteListItem, VoteStatusType } from '../list-items'
import i18n from '../../i18n'

interface IDashboardProcessListItemProps {
  process: ProcessInfo
  status: VoteStatusType
  accountName?: string
}

export const DashboardProcessListItem = ({
  process,
  accountName,
  status,
}: IDashboardProcessListItemProps) => {
  const [endDate, setEndDate] = useState<string>('')
  const { poolPromise } = usePool()

  useEffect(() => {
    poolPromise.then(async (pool: GatewayPool) => {
      switch (status) {
        case VoteStatusType.Active:
          const remainDays = await getRemainingDays(process, pool)

          setEndDate(remainDays)
          break

        case VoteStatusType.Ended:
          setEndDate(i18n.t('dashboard.process_finished'))
          break

        case VoteStatusType.Paused:
          setEndDate(i18n.t('dashboard.process_paused'))
          break
      }
    })
  }, [poolPromise])

  return (
    <VoteListItem
      icon={
        <ProcessImageContainer>
          <img src={process.metadata.media.header} />
        </ProcessImageContainer>
      }
      description={process.metadata.description.default}
      title={process.metadata.title.default}
      processId={process.id}
      entityName={accountName}
      dateText={endDate}
      status={status}
    />
  )
}
const ProcessImageContainer = styled.div`
  & > img {
    width: 100%;
    max-width: 200px;
  }
`
