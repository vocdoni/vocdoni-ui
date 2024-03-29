import React, { useEffect, useState } from 'react'
import { Account } from '@lib/types'
import { EntityMetadata } from 'dvote-js';
import { SummaryProcess } from '@vocdoni/react-hooks'
import { useTranslation } from 'react-i18next';

import { Column, Grid } from '../../elements/grid'
import { VoteStatus } from '@lib/util'
import { Skeleton } from '../../blocks/skeleton'
import { Card } from '../../elements/cards'

import { DashboardCreateProposalCard } from './create-proposal-card'
import { EmptyProposalCard } from './empty-proposal-card'
import { DashboardProcessListNav } from './process-list-nav'
import { DashboardProcessListItem } from './process-list-item'
import { SHOW_PROCESS_PATH } from '@const/routes';

export enum ProcessTypes {
  ActiveVotes = 'activeVotes',
  VoteResults = 'voteResults',
  UpcomingVotes = 'upcomingVotes',
}

export interface IProcessItem {
  label: string
  items?: SummaryProcess[]
  status: VoteStatus
}

interface IDashboardProcessListProps {
  account: Account
  initialActiveItem: ProcessTypes
  activeVotes: SummaryProcess[]
  votesResults: SummaryProcess[]
  upcomingVoting: SummaryProcess[]
  entityMetadata: EntityMetadata
  loading?: boolean
  skeletonItems?: number
}

export const DashboardProcessList = ({
  account,
  initialActiveItem,
  activeVotes,
  votesResults,
  upcomingVoting,
  entityMetadata,
  loading,
  skeletonItems = 3,
}: IDashboardProcessListProps) => {
  const { i18n } = useTranslation()

  const navItems: Map<ProcessTypes, IProcessItem> = new Map([
    [
      ProcessTypes.ActiveVotes,
      {
        label: i18n.t('dashboard.active_votes'),
        items: activeVotes,
        status: VoteStatus.Active,
      },
    ],
    [
      ProcessTypes.VoteResults,
      {
        label: i18n.t('dashboard.vote_results'),
        items: votesResults,
        status: VoteStatus.Ended,
      },
    ],
    [
      ProcessTypes.UpcomingVotes,
      {
        label: i18n.t('dashboard.upcoming_votes'),
        items: upcomingVoting,
        status: VoteStatus.Upcoming,
      },
    ],
  ])

  const renderProcessItem = (process: SummaryProcess) => (
    <div key={process.id}>
      <DashboardProcessListItem
        process={process}
        status={processList.status}
        accountName={account?.name}
        entityLogo={entityMetadata?.media?.avatar}
        link={ SHOW_PROCESS_PATH + "#/" + process.id }
      />
    </div>
  )
  const renderSkeleton = () => {
    return (
      <Column md={8} sm={12}>
        {Array(skeletonItems)
          .fill(0)
          .map((value ,index: number) => (
            <Card key={index}>
              <Skeleton />
            </Card>
          ))}
      </Column>
    )
  }

  const handleClick = (navItem: ProcessTypes) => {
    setActiveList(navItem)
  }
  const [activeList, setActiveList] = useState<ProcessTypes>(
    ProcessTypes.ActiveVotes
  )
  const processList = navItems.get(activeList)

  useEffect(() => {
    setActiveList(initialActiveItem)
  }, [initialActiveItem])

  return (
    <>
      <DashboardProcessListNav
        activeItem={activeList}
        navItems={navItems}
        onClick={handleClick}
      />

      <Grid>
        {loading ? (
          renderSkeleton()
        ) : processList?.items && processList.items.length ? (
          <Column md={8} sm={12}>
            {processList.items.map(renderProcessItem)}
          </Column>
        ) : (
          <EmptyProposalCard />
        )}

        <DashboardCreateProposalCard />
      </Grid>
    </>
  )
}
