import React, { useEffect, useRef, useState } from 'react'
import { ProcessInfo } from '@vocdoni/react-hooks'

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
import { useBlockNumber } from '../../hooks/use-blocknumber'

const DashboardPage = () => {
  const [activeVotes, setActiveVotes] = useState<ProcessInfo[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<ProcessInfo[]>([])
  const [votesResults, setVotesResults] = useState<ProcessInfo[]>([])

  const { wallet } = useWallet()
  const { dbAccounts } = useDbAccounts()
  const { blockNumber } = useBlockNumber()
  // TODO: use loadingProcessList and loadingProcessesDetails to wait until data is loaded
  // TODO: call useProcessesFromAccount(wallet.address) instead of below
  const {
    processIds,
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
      if (!proc || !proc.parameters) continue
      else if (proc.parameters?.status?.isCanceled) continue
      // ignore
      else if (proc.parameters?.startBlock > blockNumber) upcoming.push(proc)
      else if (processEndBlock(proc) < blockNumber) results.push(proc)
      else if (
        proc.parameters?.status?.isEnded ||
        proc.parameters?.status?.hasResults
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
  }, [processIds, loadingProcessList, loadingProcessesDetails])

  return (
    <>
      <DashboardHeader account={account} />

      <DashboardActivitySummary
        loading={loadingProcessList || loadingProcessesDetails}
        activeVotes={activeVotes.length}
        upcomingVotes={upcomingVotes.length}
        votesResults={votesResults.length}
      />

      <DashboardProcessList
        initialActiveItem={initialActiveItem.current}
        loading={loadingProcessList || loadingProcessesDetails}
        account={account}
        activeVotes={activeVotes}
        votesResults={votesResults}
        upcomingVoting={upcomingVotes}
      />
    </>
  )
}

// HELPERS

const processEndBlock = (process: ProcessInfo) =>
  process.parameters?.startBlock + process.parameters?.blockCount

export default DashboardPage
