import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { usePool, ProcessInfo } from '@vocdoni/react-hooks'
import { GatewayPool } from 'dvote-js'

import { getDaysUntilEnd } from '../../lib/date'

import { VoteListItem, VoteStatusType } from '../list-items'
import { ImageContainer } from '../images'
import i18n from '../../i18n'
import { FALLBACK_ACCOUNT_ICON } from '@const/account'

interface IDashboardProcessListItemProps {
  process: ProcessInfo
  status: VoteStatusType
  accountName?: string
  entityLogo?: string
}

export const DashboardProcessListItem = ({
  process,
  accountName,
  status,
  entityLogo
}: IDashboardProcessListItemProps) => {
  const [endDate, setEndDate] = useState<string>('')
  const { poolPromise } = usePool()
  
  useEffect(() => {
    poolPromise.then(async (pool: GatewayPool) => {
      switch (status) {
        case VoteStatusType.Active:
          const remainDays = await getDaysUntilEnd(process, pool)

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
    <VoteItemWrapper>
      <VoteListItem
        icon={
          <ImageContainer width="30px">
            <img src={entityLogo || FALLBACK_ACCOUNT_ICON} />
          </ImageContainer>
        }
        description={process.metadata.description.default}
        title={process.metadata.title.default}
        processId={process.id}
        entityName={accountName}
        dateText={endDate}
        status={status}
      />
    </VoteItemWrapper>
  )
}

const VoteItemWrapper = styled.div`
  margin-bottom: 10px;
`
