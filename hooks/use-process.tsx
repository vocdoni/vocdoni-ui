import { usePool } from '@vocdoni/react-hooks'
import { GatewayPool, ProcessStatus } from 'dvote-js'

import { ProcessInfo } from '../lib/types'
import { getProcesses } from '../lib/api'

export interface IFilteredProcess {
  activeVotes: ProcessInfo[],
  upcomingVotes: ProcessInfo[],
  voteResults: ProcessInfo[]
}

interface ICachedProcesses {
  [key: string]: IFilteredProcess
}

const cachedProcesses: ICachedProcesses = {}

export const useProcess = () => {
  const { poolPromise } = usePool()

  const getAccountProcesses = async (accountAddress: string) => {
    if (cachedProcesses[accountAddress]) return process[accountAddress]

    const pool: GatewayPool = await poolPromise
    const accountProcess = await getProcesses(accountAddress, pool)
    
    const activeVotes = accountProcess.filter(
      (process) =>
        process.parameters?.status.value === ProcessStatus.READY
    )
    const upcomingVotes = accountProcess.filter(
      (process) =>
        process.parameters?.status.value === ProcessStatus.ENDED
    )
    const voteResults = accountProcess.filter(
      (process) =>
        process.parameters?.status.value === ProcessStatus.RESULTS
    )

    cachedProcesses[accountAddress] = {
      activeVotes,
      upcomingVotes,
      voteResults
    }

    return cachedProcesses[accountAddress]
  }

  return { getAccountProcesses }
}
