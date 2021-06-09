import React, { useEffect, useState } from 'react'
import { Account } from '@lib/types'
import { IProcessDetails, EntityMetadata } from 'dvote-js';

import i18n from '../../i18n'
import { Column, Grid } from '../grid'
import { VoteStatus } from '@lib/util'
import { Skeleton } from '../skeleton'
import { Card } from '../cards'

import { DashboardCreateProposalCard } from './create-proposal-card'
import { EmptyProposalCard } from './empty-proposal-card'
import { DashboardProcessListNav } from './process-list-nav'
import { DashboardProcessListItem } from './process-list-item'

export enum ProcessTypes {
  ActiveVotes = 'activeVotes',
  VoteResults = 'voteResults',
  UpcomingVotes = 'upcomingVotes',
}

export interface IProcessItem {
  label: string
  items?: IProcessDetails[]
  status: VoteStatus
}

interface IDashboardProcessListProps {
  account: Account
  initialActiveItem: ProcessTypes
  activeVotes: IProcessDetails[]
  votesResults: IProcessDetails[]
  upcomingVoting: IProcessDetails[]
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
  const renderProcessItem = (process: IProcessDetails) => (
    <div key={process.id}>
      <DashboardProcessListItem
        process={process}
        status={processList.status}
        accountName={account?.name}
        entityLogo={entityMetadata?.media?.avatar}
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
