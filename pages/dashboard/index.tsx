import React, { useEffect, useRef, useState } from 'react'
import { useEntity, useBlockHeight } from '@vocdoni/react-hooks'
import { IProcessDetails, IProcessSummary, ProcessMetadata, VochainProcessStatus } from 'dvote-js'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
  ProcessTypes,
} from '../../components/dashboard'

import { Account, IProcessesSummary } from '../../lib/types'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'
import { useProcessesFromAccount } from '../../hooks/use-processes'

import { LayoutEntity } from '@components/layout/entity'

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

  const hasDbAccountAndWallet = wallet?.address && dbAccounts.length
  const account: Account | null = hasDbAccountAndWallet
    ? dbAccounts.find(
      (iterateAccount) => iterateAccount.address == wallet.address
    )
    : null
  let initialActiveItem = useRef<ProcessTypes>(ProcessTypes.ActiveVotes);
  const sortEndBlock = (process1: IProcessesSummary, process2: IProcessesSummary) => {
    return process1.summary.endBlock - process2.summary.endBlock
  } 
  const sortEndDescBlock = (process1: IProcessesSummary, process2: IProcessesSummary) => {
    return process2.summary.endBlock - process1.summary.endBlock
  } 

  const activeVotes: IProcessesSummary[] = []
  const votesResults: IProcessesSummary[] = []
  const upcomingVotes: IProcessesSummary[] = []

  for (let proc of processes) {
    // info not loaded yet
    if (!proc || !proc.summary) continue
    else if (proc.summary?.status === VochainProcessStatus.CANCELED) continue
    // ignore
    else if (proc.summary?.startBlock > blockHeight) upcomingVotes.push(proc)
    else if (proc.summary?.endBlock < blockHeight) votesResults.push(proc)
    else if (
      proc.summary?.status === VochainProcessStatus.ENDED ||
      proc.summary?.status === VochainProcessStatus.RESULTS
    ) {
      votesResults.push(proc)
    }
    // Ready or paused
    else {
      activeVotes.push(proc)
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
