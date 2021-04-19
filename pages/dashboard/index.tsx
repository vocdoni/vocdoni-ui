import React, { useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { GatewayPool, ProcessStatus } from 'dvote-js'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
} from '../../components/dashboard'

import { Account, ProcessInfo } from '../../lib/types'
import { getProcesses } from '../../lib/api'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'

const DashboardPage = () => {
  const [activeVotes, setActiveVotes] = useState<ProcessInfo[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<ProcessInfo[]>([])
  const [votesResults, setVotesResults] = useState<ProcessInfo[]>([])

  const { poolPromise } = usePool()
  const { wallet } = useWallet()
  const { dbAccounts } = useDbAccounts()

  const hasDbAccountAndWallet = wallet && wallet.address && dbAccounts.length
  const hasWalletAddress = wallet && wallet.address
  const account: Account | null = hasDbAccountAndWallet
    ? dbAccounts.find(
        (iterateAccount) => iterateAccount.address == wallet.address
      )
    : null

  useEffect(() => {
    if (hasWalletAddress) {
      poolPromise.then(async (pool: GatewayPool) => {
        const processes = await getProcesses(wallet.address, pool)

        setActiveVotes(
          processes.filter(
            (process) =>
              process.parameters?.status.value === ProcessStatus.READY
          )
        )

        setVotesResults(
          processes.filter(
            (process) =>
              process.parameters?.status.value === ProcessStatus.RESULTS
          )
        )

        setUpcomingVotes(
          processes.filter(
            (process) =>
              process.parameters?.status.value === ProcessStatus.ENDED
          )
        )
      })
    } 
  }, [wallet])

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

export default DashboardPage
