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
  const {blockNumber} = useBlockNumber()
  // TODO: use loadingProcessList and loadingProcessesDetails to wait until data is loaded
  const { processes, loadingProcessList, loadingProcessesDetails } = useProcessesFromAccount('0x2Df8B6979fa7e75FFb6B464eD2c913Ab90995afA')

  const hasDbAccountAndWallet = wallet && wallet.address && dbAccounts.length
  const account: Account | null = hasDbAccountAndWallet
    ? dbAccounts.find(
        (iterateAccount) => iterateAccount.address == wallet.address
      )
    : null

  const processFinishTime = (process: ProcessInfo) =>
    process.parameters.startBlock + process.parameters.blockCount

  useEffect(() => {
    setActiveVotes(
      Array.from(processes.values()).filter(
        (process) => process.parameters?.status.value === ProcessStatus.READY &&
          processFinishTime(process) < blockNumber
      )
    )

    setVotesResults(
       Array.from(processes.values()).filter(
         // TODO: Fix the results case
        (process) => process.parameters?.status.value === ProcessStatus.RESULTS
      )
    )

    setUpcomingVotes(
       Array.from(processes.values()).filter(
        (process) => process.parameters?.status.value === ProcessStatus.ENDED ||
          processFinishTime(process) < blockNumber
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
