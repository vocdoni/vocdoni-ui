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
  const [account, setAccount] = useState<Account | null>()

  const [activeVotes, setActiveVotes] = useState<ProcessInfo[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<ProcessInfo[]>([])
  const [votesResults, setVotesResults] = useState<ProcessInfo[]>([])

  const { poolPromise } = usePool()
  const { wallet } = useWallet()
  const { dbAccounts } = useDbAccounts()

  useEffect(() => {
    const hasWalletAddress = wallet && wallet.address

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

  useEffect(() => {
    const hasDbAccountAndWallet = wallet && wallet.address && dbAccounts.length

    if (hasDbAccountAndWallet) {
      setAccount(
        dbAccounts.find(
          (iterateAccount) => iterateAccount.address == wallet.address
        )
      )
    }
  }, [wallet, dbAccounts])

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
