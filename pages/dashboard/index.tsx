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

const DashboardPage = () => {
  const [activeVotes, setActiveVotes] = useState<ProcessInfo[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<ProcessInfo[]>([])
  const [votesResults, setVotesResults] = useState<ProcessInfo[]>([])

  const { wallet } = useWallet()
  const { dbAccounts } = useDbAccounts()
  const accountAddress = wallet ? wallet.address: ''
  const { processes } = useProcessesFromAccount(accountAddress)

  const hasDbAccountAndWallet = wallet && wallet.address && dbAccounts.length
  const account: Account | null = hasDbAccountAndWallet
    ? dbAccounts.find(
        (iterateAccount) => iterateAccount.address == wallet.address
      )
    : null

  useEffect(() => {
    setActiveVotes(
      processes.filter(
        (process) => process.parameters?.status.value === ProcessStatus.READY
      )
    )

    setVotesResults(
      processes.filter(
        (process) => process.parameters?.status.value === ProcessStatus.RESULTS
      )
    )

    setUpcomingVotes(
      processes.filter(
        (process) => process.parameters?.status.value === ProcessStatus.ENDED
      )
    )
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

export default DashboardPage
