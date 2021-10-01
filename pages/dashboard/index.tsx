import React, { useEffect, useRef, useState } from 'react'
import { useEntity, useBlockHeight, SummaryProcess } from '@vocdoni/react-hooks'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
  ProcessTypes,
} from '@components/pages/dashboard'
import { LayoutEntity } from '@components/pages/app/layout/entity'

import { Account } from '@lib/types'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import { useProcessesFromAccount } from '@hooks/use-processes'
import { getVoteStatus, VoteStatus } from '@lib/util'


// NOTE: This page uses a custom Layout. See below.

const DashboardPage = () => {
  const { wallet } = useWallet()
  const { dbAccounts } = useDbAccounts()
  const { blockHeight } = useBlockHeight()
  const { metadata: entityMetadata } = useEntity(wallet?.address)

  const {
    processes,
    loadingProcessList,
    loadingProcessesDetails,
  } = useProcessesFromAccount(wallet?.address)
  // NOTE: processes is a singleton map (for efficiency reasons). This means that no re-render will occur based on `processes`.
  //       Use processIds and loadingProcessList + loadingProcessesDetails instead.
  console.log(processes)
  const hasDbAccountAndWallet = wallet?.address && dbAccounts.length
  const account: Account | null = hasDbAccountAndWallet
    ? dbAccounts.find(
      (iterateAccount) => iterateAccount.address == wallet.address
    )
    : null
  let initialActiveItem = useRef<ProcessTypes>(ProcessTypes.ActiveVotes);
  const sortEndBlock = (process1: SummaryProcess, process2: SummaryProcess) => {
    return process1.summary.endBlock - process2.summary.endBlock
  } 
  const sortEndDescBlock = (process1: SummaryProcess, process2: SummaryProcess) => {
    return process2.summary.endBlock - process1.summary.endBlock
  } 

  const activeVotes: SummaryProcess[] = []
  const votesResults: SummaryProcess[] = []
  const upcomingVotes: SummaryProcess[] = []

  for (let proc of processes) {
    // info not loaded yet
    if (!proc || !proc.summary) continue

    const voteStatus: VoteStatus = getVoteStatus(proc.summary, blockHeight)

    switch (voteStatus) {
      case VoteStatus.Canceled:
        continue
        
      case VoteStatus.Active:
        activeVotes.push(proc)
        break

      case VoteStatus.Ended:
        votesResults.push(proc)
        break

      case VoteStatus.Upcoming:
        upcomingVotes.push(proc)
        break

      default:
        break;
    }
  }
  
  activeVotes.sort(sortEndBlock)
  votesResults.sort(sortEndDescBlock)
  upcomingVotes.sort(sortEndDescBlock)

  useEffect(() => {
    if (loadingProcessList) return

    initialActiveItem.current = activeVotes.length
      ? ProcessTypes.ActiveVotes
      : votesResults.length
        ? ProcessTypes.VoteResults
        : upcomingVotes.length
          ? ProcessTypes.UpcomingVotes
          : ProcessTypes.ActiveVotes

  }, [loadingProcessList, loadingProcessesDetails])

  return (
    <>
      <DashboardHeader entity={entityMetadata} hasBackup={account?.hasBackup} />

      <DashboardActivitySummary
        loading={loadingProcessList || loadingProcessesDetails}
        activeVotes={activeVotes.length}
        upcomingVotes={upcomingVotes.length}
        votesResults={votesResults.length}
      />

      <DashboardProcessList
        initialActiveItem={initialActiveItem.current}
        loading={loadingProcessList || loadingProcessesDetails}
        entityMetadata={entityMetadata}
        account={account}
        activeVotes={activeVotes}
        votesResults={votesResults}
        upcomingVoting={upcomingVotes}
      />
    </>
  )
}

// Defining the custom layout to use
DashboardPage["Layout"] = LayoutEntity

export default DashboardPage
