import { useEffect, useState } from 'react'
import { usePool, useProcesses } from '@vocdoni/react-hooks'
import { getProcessList } from '../lib/api'
import { useWallet } from './use-wallet'
import { useMessageAlert } from './message-alert'
import i18n from '../i18n'
import { utils } from 'ethers'


export const useProcessesFromAccount = (entityId: string) => {
  if (entityId) entityId = utils.getAddress(entityId)

  const [processIds, setProcessIds] = useState([] as string[])
  const [loadingProcessList, setLoadingProcessList] = useState(true)
  const { setAlertMessage } = useMessageAlert()
  const { wallet } = useWallet()
  const { processes, error, loading: loadingProcessesDetails, reloadProcesses } = useProcesses(
    processIds || [],
    false
  )
  const { poolPromise } = usePool()

  useEffect(() => {
    updateProcessIds()
  }, [wallet, entityId])

  useEffect(() => {
    const interval = setInterval(() => reloadProcesses(), 1000 * 60)

    // Done
    return () => clearInterval(interval)
  }, [processIds])

  // Loaders
  const updateProcessIds = () => {
    if (!entityId) return
    setLoadingProcessList(true)

    poolPromise
      .then((pool) => getProcessList(entityId, pool))
      .then((ids) => {
        setLoadingProcessList(false)
        setProcessIds(ids)
      })
      .catch((err) => {
        setLoadingProcessList(false)

        console.error(err)
        setAlertMessage(i18n.t("errors.the_list_of_votes_cannot_be_loaded"))
      })
  }

  return { processIds, processes, loadingProcessList, loadingProcessesDetails, error }
}
