import React, { useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'

import {
  DashboardActivitySummary,
  DashboardHeader,
  DashboardProcessList,
} from '../../components/dashboard'

import { Account, ProcessInfo } from '../../lib/types'
import { getProcesses } from '../../lib/api'
import { GatewayPool, ProcessStatus } from 'dvote-js'
import { useDbAccounts } from '../../hooks/use-db-accounts'

const accountRegexp = /\/account\/(0x.+)[\/?]?/

const DashboardPage = () => {
  const [account, setAccount] = useState<Account | null>()
  const [activeVotes, setActiveVotes] = useState<ProcessInfo[]>([])
  const [upcomingVotes, setUpcomingVotes] = useState<ProcessInfo[]>([])
  const [votesResults, setVotesResults] = useState<ProcessInfo[]>([])

  const router = useRouter()
  const { poolPromise } = usePool()
  const { dbAccounts } = useDbAccounts()

  const getUrlAccount = () =>
    accountRegexp.test(router.asPath)
      ? accountRegexp.exec(router.asPath)[1]
      : null

  useEffect(() => {
    const urlAccount: string | null = getUrlAccount()

    if (urlAccount) {
      poolPromise.then(async (pool: GatewayPool) => {
        const processes = await getProcesses(urlAccount, pool)

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
  }, [router.asPath])

  useEffect(() => {
    if (dbAccounts.length) {
      const urlAccount: string | null = getUrlAccount()

      setAccount(
        dbAccounts.find(
          (iterateAccount) => iterateAccount.address == urlAccount
        )
      )
    }
  }, [dbAccounts])

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
