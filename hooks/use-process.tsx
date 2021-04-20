import { useEffect, useState } from 'react'
import { usePool } from '@vocdoni/react-hooks'
import { getProcessList } from '../lib/api'
import { useProcesses } from '@vocdoni/react-hooks'
import { useWallet } from './use-wallet'
import { useMessageAlert } from './message-alert'
import i18n from '../i18n'


export const useProcessesFromAccount = (entityId: string) => {
  const [processIds, setProcessIds] = useState([] as string[])
  const [loadingProcessList, setLoadingProcessList] = useState(true)
  const { setAlertMessage } = useMessageAlert()
  const { wallet } = useWallet()
  const { processes, error, loading: loadingProcessesDetails } = useProcesses(
    processIds || []
  )
  const { poolPromise } = usePool()

  // Effects

  useEffect(() => {
    const interval = setInterval(() => updateProcessIds, 1000 * 60)
    updateProcessIds()

    // Done
    return () => clearInterval(interval)
  }, [wallet, entityId])

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

  return { processes, loadingProcessList, loadingProcessesDetails, error }
}
