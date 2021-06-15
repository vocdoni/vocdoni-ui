import React, { useEffect, useRef, useState } from 'react'
import { useEntity, useBlockHeight } from '@vocdoni/react-hooks'
import { IProcessDetails, VochainProcessStatus } from 'dvote-js'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
  ProcessTypes,
} from '../../components/dashboard'

import { Account } from '../../lib/types'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'
import { useProcessesFromAccount } from '../../hooks/use-processes'

import { LayoutEntity } from '@components/layout/entity'

// NOTE: This page uses a custom Layout. See below.

const DashboardPage = () => {
  const [activeVotes, setActiveVotes] = useState<IProcessDetails[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<IProcessDetails[]>([])
  const [votesResults, setVotesResults] = useState<IProcessDetails[]>([])

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

  useEffect(() => {
    if (loadingProcessList) return

    const active = []
    const results = []
    const upcoming = []

    for (let proc of processes.values()) {
      // info not loaded yet
      if (!proc || !proc.summary) continue
      else if (proc.summary?.status === VochainProcessStatus.CANCELED) continue
      // ignore
      else if (proc.summary?.startBlock > blockHeight) upcoming.push(proc)
      else if (proc.summary?.endBlock < blockHeight) results.push(proc)
      else if (
        proc.summary?.status === VochainProcessStatus.ENDED ||
        proc.summary?.status === VochainProcessStatus.RESULTS
      ) {
        results.push(proc)
      }
      // Ready or paused
      else {
        active.push(proc)
      }
    }

    initialActiveItem.current = active.length
      ? ProcessTypes.ActiveVotes
      : results.length
        ? ProcessTypes.VoteResults
        : upcoming.length
          ? ProcessTypes.UpcomingVotes
          : ProcessTypes.ActiveVotes

    setActiveVotes(active)
    setVotesResults(results)
    setUpcomingVotes(upcoming)
  }, [processes])

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
