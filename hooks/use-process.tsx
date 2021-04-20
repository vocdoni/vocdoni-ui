import { useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { getProcessList } from '../lib/api'
import { useProcesses } from '@vocdoni/react-hooks'
import { useWallet } from './use-wallet'
import { useMessageAlert } from './message-alert'


export const useProcessesFromAccount = (accountAddress: string) => {
  const [processIds, setProcessIds] = useState([] as string[]);
  const [loadingProcessList, setLoadingProcessList] = useState(true);
  const { setAlertMessage } = useMessageAlert()
  const {wallet} = useWallet()
  const { processes, error, loading: loadingProcessesDetails } = useProcesses(
    processIds || []
  );
  const { poolPromise } = usePool()


  // Effects

  useEffect(() => {
    const interval = setInterval(() => updateProcessIds, 1000 * 60 )
    updateProcessIds()

    // Done
    return () => clearInterval(interval);
  }, [wallet, accountAddress])

  // Loaders
  const updateProcessIds = () => {
    if (!(wallet && wallet.address) || !accountAddress) return
    const address = (wallet && wallet.address) ? wallet.address : accountAddress
    setLoadingProcessList(true)

    poolPromise
      .then((pool) => getProcessList(address, pool))
      .then((ids) => {
        setLoadingProcessList(false)
        setProcessIds(ids)
      })
      .catch((err) => {
        setLoadingProcessList(false)

        console.error(err)
        setAlertMessage("The list of processes could not be loaded")
      })
  }

  return { processes, loadingProcessList, loadingProcessesDetails, error }
}
