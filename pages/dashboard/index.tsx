import React, { useEffect, useState } from 'react'
import { ProcessStatus } from 'dvote-js'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
} from '../../components/dashboard'

import { Account, ProcessInfo } from '../../lib/types'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'
import { IFilteredProcess, useProcess } from '../../hooks/use-process'

const DashboardPage = () => {
  const [activeVotes, setActiveVotes] = useState<ProcessInfo[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<ProcessInfo[]>([])
  const [votesResults, setVotesResults] = useState<ProcessInfo[]>([])

  const { wallet } = useWallet()
  const { getAccountProcesses } = useProcess()
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
      getAccountProcesses('0x2Df8B6979fa7e75FFb6B464eD2c913Ab90995afA').then(
        ({ activeVotes, upcomingVotes, voteResults }: IFilteredProcess) => {
          setActiveVotes(activeVotes)
          setVotesResults(upcomingVotes)
          setUpcomingVotes(voteResults)
        }
      )
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
