import { useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { GatewayPool } from 'dvote-js'

import { ProcessInfo } from '../lib/types'
import { getProcesses } from '../lib/api'


export const useProcessesFromAccount = (accountAddress: string) => {
  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const { poolPromise } = usePool();

  useEffect(() => {
    poolPromise.then(async (pool: GatewayPool) => {
      const accountProcesses = await getProcesses(accountAddress, pool)

      setProcesses(accountProcesses);
    }) 
  }, [accountAddress])

  return { processes }
}
