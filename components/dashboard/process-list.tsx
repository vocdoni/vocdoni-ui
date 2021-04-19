import React, { useState } from 'react'

import i18n from '../../i18n'
import { ProcessInfo, Account } from '../../lib/types'
import { Column, Grid } from '../grid'
import { VoteListItem, VoteStatusType } from '../list-items'

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
  items?: ProcessInfo[]
  status: VoteStatusType
}

interface IDashboardProcessListProps {
  account: Account
  activeVotes: ProcessInfo[]
  votesResults: ProcessInfo[]
  upcomingVoting: ProcessInfo[]
}

export const DashboardProcessList = ({
  account,
  activeVotes,
  votesResults,
  upcomingVoting,
}: IDashboardProcessListProps) => {
  const navItems: Map<ProcessTypes, IProcessItem> = new Map([
    [
      ProcessTypes.ActiveVotes,
      {
        label: i18n.t('dashboard.active_votes'),
        items: activeVotes,
        status: VoteStatusType.Active,
      },
    ],
    [
      ProcessTypes.VoteResults,
      {
        label: i18n.t('dashboard.vote_results'),
        items: votesResults,
        status: VoteStatusType.Ended,
      },
    ],
    [
      ProcessTypes.UpcomingVotes,
      {
        label: i18n.t('dashboard.upcoming_votes'),
        items: upcomingVoting,
        status: VoteStatusType.Paused,
      },
    ],
  ])
  const renderProcessItem = (process: ProcessInfo) => (
    <div key={process.id}>
      <DashboardProcessListItem
        process={process}
        status={processList.status}
        accountName={account?.name}
      />
    </div>
  )
  const handleClick = (navItem: ProcessTypes) => {
    setActiveList(navItem)
  }
  const [activeList, setActiveList] = useState<ProcessTypes>(
    ProcessTypes.ActiveVotes
  )
  const processList = navItems.get(activeList)

  return (
    <>
      <DashboardProcessListNav navItems={navItems} onClick={handleClick} />

      <Grid>
        {processList?.items && processList.items.length ? (
          <Column md={8} sm={12} >{processList.items.map(renderProcessItem)}</Column>
        ) : (
          <EmptyProposalCard />
        )}

        <DashboardCreateProposalCard />
      </Grid>
    </>
  )
}
