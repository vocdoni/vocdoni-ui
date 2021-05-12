import { ProcessInfo, usePool, useProcess, useBlockHeight, useDateAtBlock } from '@vocdoni/react-hooks'
import { DigestedProcessResults, ProcessStatus, VotingApi } from 'dvote-js'
import { createContext, ReactNode, useEffect, useState } from 'react'

import i18n from '../i18n'
// import { useUrlHash } from 'use-url-hash'
import { useMessageAlert } from './message-alert'
import { DateDiffType, localizedStrDateDiff } from '../lib/date'

export interface ProcessWrapperContext {
  loadingInfo: boolean,
  loadingInfoError: string,

  processInfo: ProcessInfo,

  hasStarted: boolean,
  hasEnded: boolean,
  remainingTime: string,
  statusText: string,
  processId: string,
  results: DigestedProcessResults,

}

export const UseProcessWrapperContext = createContext<ProcessWrapperContext>({} as any)

export const useProcessWrapper = (processId: string) => {
  // const processCtx = useContext(UseProcessWrapperContext)
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-A]{64}$/)

  // if (processCtx === null) {
  //   throw new Error('useVoting() can only be used on the descendants of <UseProcessProvider />,')
  // }

  const { poolPromise } = usePool()
  const { setAlertMessage } = useMessageAlert()
  const { blockHeight } = useBlockHeight()
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo } = useProcess(processId)
  const [results, setResults] = useState(null as DigestedProcessResults)

  const startBlock = processInfo?.parameters?.startBlock || 0
  const endBlock = startBlock + (processInfo?.parameters?.blockCount || 0)
  const { date: startDate, loading: dateLoading, error: dateError } = useDateAtBlock(startBlock)
  const { date: endDate } = useDateAtBlock(endBlock)

  // Effects

  // Vote results
  useEffect(() => {
    updateResults()
  }, [processId, blockHeight])

  // Loaders

  const updateResults = () => {
    if (!processId || invalidProcessId) return

    poolPromise
      .then((pool) => VotingApi.getResultsDigest(processId, pool))
      .then((results) => setResults(results))
      .catch((err) => console.error(err))
  }

  // Callbacks
  const hasStarted = startDate && startDate.getTime() <= Date.now()
  const hasEnded = endDate && endDate.getTime() < Date.now()


  const remainingTime = (startBlock && startDate)
    ? hasStarted
      ? localizedStrDateDiff(DateDiffType.End, endDate)
      : localizedStrDateDiff(DateDiffType.Start, startDate)
    : ''

  let statusText: string = ''
  switch (processInfo?.parameters.status.value) {
    case ProcessStatus.READY:
      if (hasEnded) statusText = i18n.t("status.the_vote_has_ended")
      else if (hasStarted) statusText = i18n.t("status.the_vote_is_open_for_voting")
      else if (!hasStarted)
        statusText = i18n.t("status.the_vote_will_start_soon")
      break
    case ProcessStatus.PAUSED:
      statusText = i18n.t("status.the_vote_is_paused")
      break
    case ProcessStatus.CANCELED:
      statusText = i18n.t("status.the_vote_is_canceled")
      break
    case ProcessStatus.ENDED:
    case ProcessStatus.RESULTS:
      statusText = i18n.t("status.the_vote_has_ended")
      break
  }

  // RETURN VALUES
  return {
    loadingInfoError,
    loadingInfo,
    processInfo,
    hasStarted,
    hasEnded,
    processId,
    remainingTime,
    statusText,
    results
  }
}

export const UseProcessWrapperProvider = ({ processId, children }: { processId: string, children: ReactNode }) => {
  const value = useProcessWrapper(processId)
  return (
    <UseProcessWrapperContext.Provider value={value}>
      {children}
    </UseProcessWrapperContext.Provider>
  )
}
