import React, { useEffect, useState } from 'react'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
} from '../../components/dashboard'

import { Account, ProcessInfo } from '../../lib/types'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'
import { useProcessesFromAccount } from '../../hooks/use-process'
import { ProcessStatus } from 'dvote-solidity'
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
  const { processes, loadingProcessList, loadingProcessesDetails } = useProcessesFromAccount('0x2Df8B6979fa7e75FFb6B464eD2c913Ab90995afA')

  const hasDbAccountAndWallet = wallet && wallet.address && dbAccounts.length
  const account: Account | null = hasDbAccountAndWallet
    ? dbAccounts.find(
      (iterateAccount) => iterateAccount.address == wallet.address
    )
    : null

  useEffect(() => {
    const active = []
    const results = []
    const upcoming = []

    for (let proc of processes.values()) {
      if (proc.parameters?.status?.isCanceled) continue // ignore

      if (proc.parameters.startBlock > blockNumber) upcoming.push(proc)
      else if (processEndBlock(proc) < blockNumber) results.push(proc)

      else if (proc.parameters?.status?.isEnded || proc.parameters?.status?.hasResults) {
        results.push(proc)
      }
      // Ready or paused
      else {
        active.push(proc)
      }
    }
    setActiveVotes(active)
    setVotesResults(results)
    setUpcomingVotes(upcoming)
  }, [processes])

  return (
    <>
      <DashboardHeader account={account} />

      <DashboardActivitySummary
        activeVotes={activeVotes.length}
        upcomingVotes={upcomingVotes.length}
        votesResults={votesResults.length}
      />

      <DashboardProcessList
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
  process.parameters.startBlock + process.parameters.blockCount

export default DashboardPage
