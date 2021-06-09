import { usePool, useProcess, useBlockHeight, useDateAtBlock, UseProcessContext } from '@vocdoni/react-hooks'
import { IProcessDetails, DigestedProcessResults, VotingApi } from 'dvote-js'
import { ProcessStatus } from '@const/process';

import { useEffect, useState } from 'react'

import i18n from '../i18n'
// import { useUrlHash } from 'use-url-hash'
// import { useMessageAlert } from './message-alert'
import { DateDiffType, localizedStrDateDiff } from '../lib/date'

export interface ProcessWrapperContext {
  loadingInfo: boolean,
  loadingInfoError: string,

  processInfo: IProcessDetails,

  hasStarted: boolean,
  hasEnded: boolean,
  remainingTime: string,
  statusText: string,
  processId: string,
  results: DigestedProcessResults,
  methods: {
    refreshProcessInfo: (processId: string) => Promise<IProcessDetails>
    refreshResults: () => Promise<any>
  }
}

export const useProcessWrapper = (processId: string) => {
  const invalidProcessId = !processId || !processId.match(/^0x[0-9a-fA-A]{64}$/)

  const { poolPromise } = usePool()
  // const { setAlertMessage } = useMessageAlert()
  const { blockHeight } = useBlockHeight()
  const {
    loading: loadingInfo,
    error: loadingInfoError,
    process: processInfo,
    refresh: refreshProcessInfo
  } = useProcess(processId)

  const [results, setResults] = useState(null as DigestedProcessResults)
  const [statusText, setStatusText] = useState('')

  const startBlock = processInfo?.state?.startBlock || 0
  const endBlock = startBlock + (processInfo?.state?.endBlock || 0)
  const { date: startDate, loading: dateLoading, error: dateError } = useDateAtBlock(startBlock)
  const { date: endDate } = useDateAtBlock(endBlock)

  // Effects

  useEffect(() => {
    if (invalidProcessId) return

    refreshResults()
    refreshProcessInfo(processId)
  }, [processId])

  useEffect(() => {
    if (invalidProcessId) return
    else if (blockHeight % 3 !== 0) return

    refreshResults()
    refreshProcessInfo(processId)
  }, [blockHeight])

  useEffect(() => {
    switch (processInfo?.state?.status) {
      case ProcessStatus.READY:
        if (hasEnded) setStatusText(i18n.t("status.the_vote_has_ended"))
        else if (hasStarted) setStatusText(i18n.t("status.the_vote_is_open_for_voting"))
        else if (!hasStarted)
          setStatusText(i18n.t("status.the_vote_will_start_soon"))
        break
      case ProcessStatus.PAUSED:
        setStatusText(i18n.t("status.the_vote_is_paused"))
        break
      case ProcessStatus.CANCELED:
        setStatusText(i18n.t("status.the_vote_is_canceled"))
        break
      case ProcessStatus.ENDED:
      case ProcessStatus.RESULTS:
        setStatusText(i18n.t("status.the_vote_has_ended"))
        break
    }
  }, [processInfo?.state?.status])

  // Loaders

  const refreshResults = () => {
    if (!processId || invalidProcessId) return Promise.resolve()

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
    results,
    methods: {
      refreshProcessInfo,
      refreshResults
    }
  }
}
