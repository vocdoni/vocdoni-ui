import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { usePool, ProcessInfo } from '@vocdoni/react-hooks'
import { GatewayPool } from 'dvote-js'

import { localizedEndTimeDiff } from '@lib/date'
import { VoteStatus } from '@lib/util'

import i18n from '@i18n'

import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { Image } from '@components/common/image'
import { ImageContainer } from '@components/images'

import { VoteListItem } from '../list-items'

interface IDashboardProcessListItemProps {
  process: ProcessInfo
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
  const [endDate, setEndDate] = useState<string>('')
  const { poolPromise } = usePool()

  useEffect(() => {
    poolPromise.then(async (pool: GatewayPool) => {
      switch (status) {
        case VoteStatus.Active:
          const remainDays = await localizedEndTimeDiff(process, pool)

          setEndDate(remainDays)
          break

        case VoteStatus.Ended:
          setEndDate(i18n.t('dashboard.process_finished'))
          break

        case VoteStatus.Paused:
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
            <Image src={entityLogo || FALLBACK_ACCOUNT_ICON} />
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
