import { usePool, useProcess, useBlockHeight, useDateAtBlock, UseProcessContext, CacheRegisterPrefix } from '@vocdoni/react-hooks'
import { ProcessDetails, ProcessResultsSingleChoice, VotingApi, ProcessStatus, VochainProcessStatus, IProcessStatus, ProcessState, Voting } from 'dvote-js'
import { Wallet } from '@ethersproject/wallet'

import { useContext } from 'react'
import { useEffect, useState } from 'react'

import i18n from '../i18n'

import { DateDiffType, localizedStrDateDiff } from '../lib/date'
import { IProcessResults } from '@lib/types'

export interface ProcessWrapperContext {
  loadingInfo: boolean,
  loadingInfoError: string,

  processInfo: ProcessDetails,

  hasStarted: boolean,
  hasEnded: boolean,
  remainingTime: string,
  startDate: Date,
  endDate: Date,
  statusText: string,
  processId: string,
  results: IProcessResults,
  methods: {
    refreshProcessInfo: (processId: string) => Promise<ProcessDetails>
    refreshResults: () => Promise<any>
  }
}


export const useProcessWrapper = (processId: string) => {
  const invalidProcessId = !processId || !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const processContext = useContext(UseProcessContext)
  const { poolPromise } = usePool()
  const { blockHeight } = useBlockHeight()

  const {
    loading: loadingInfo,
    error: loadingInfoError,
    process: processInfo,
    refresh,
  } = useProcess(processId)

  const [results, setResults] = useState<IProcessResults>(null)
  const [statusText, setStatusText] = useState('')

  const startBlock = processInfo?.state?.startBlock || 0
  const endBlock = processInfo?.state?.endBlock || 0
  const { date: startDate, loading: dateLoading, error: dateError } = useDateAtBlock(startBlock)
  const { date: endDate } = useDateAtBlock(endBlock)

  // Effects

  useEffect(() => {
    if (invalidProcessId) return

    refreshResults()
    refresh(processId)
  }, [processId])

  useEffect(() => {
    if (invalidProcessId) return
    else if (blockHeight % 3 !== 0) return

    refreshResults()
    refresh(processId)
  }, [blockHeight])

  useEffect(() => {
    switch (processInfo?.state?.status) {
      case VochainProcessStatus.READY:
        if (hasEnded) setStatusText(i18n.t("status.the_vote_has_ended"))
        else if (hasStarted) setStatusText(i18n.t("status.the_vote_is_open_for_voting"))
        else if (!hasStarted)
          setStatusText(i18n.t("status.the_vote_will_start_soon"))
        break
      case VochainProcessStatus.PAUSED:
        setStatusText(i18n.t("status.the_vote_is_paused"))
        break
      case VochainProcessStatus.CANCELED:
        setStatusText(i18n.t("status.the_vote_is_canceled"))
        break
      case VochainProcessStatus.ENDED:
      case VochainProcessStatus.RESULTS:
        setStatusText(i18n.t("status.the_vote_has_ended"))
        break
    }
  }, [processInfo?.state?.status])

  const waitUntilStatusUpdated = (processId: string, status: IProcessStatus): Promise<ProcessState> => {
    return new Promise(async (resolve, reject) => {
      let attempts = 10

      const checkStatusAndResolve = async (): Promise<void> => {
        const process: ProcessState = await processContext.refreshProcessState(processId)
        --attempts
        if (attempts <= 0) {
          reject('Max attempts reached')
          return
        }

        if (process.status !== status) {
          setTimeout(checkStatusAndResolve, 10000)
          return
        }

        resolve(process)
      }

      checkStatusAndResolve()
    })
  }

  const updateProcessStatus = async (processToUpdate: string, status: IProcessStatus, wallet: Wallet) => {
    const pool = await poolPromise


    await VotingApi.setStatus(
      processToUpdate,
      status,
      wallet.connect(pool.provider),
      pool
    )
  }

  const cancelProcess = async (processId: string, wallet: Wallet): Promise<void> => {
    await updateProcessStatus(processId, ProcessStatus.CANCELED, wallet)

    await waitUntilStatusUpdated(processId, VochainProcessStatus.CANCELED)

    processContext.invalidateRegister(CacheRegisterPrefix.Summary,  processId)
    refresh(processId)
  }

  const pauseProcess = async (processId: string, wallet: Wallet): Promise<void> => {
    await updateProcessStatus(processId, ProcessStatus.ENDED, wallet)

    await waitUntilStatusUpdated(processId, VochainProcessStatus.ENDED)

    processContext.invalidateRegister(CacheRegisterPrefix.Summary,  processId)
    refresh(processId)
  }
  // Loaders

  const countVotesWeight = (results: ProcessResultsSingleChoice): number => {
    return results.questions.reduce((prev, curr) => prev + curr.voteResults.reduce((p, c) => p + c.votes.toNumber(), 0), 0) / results.questions.length
  }

  const refreshResults = () => {
    if (!processId || invalidProcessId) return Promise.resolve()

    poolPromise
      .then((pool) => Promise.all([
        VotingApi.getResults(processId, pool),
        VotingApi.getProcessMetadata(processId, pool),
      ]))
      .then(([results, metadata]) =>  Voting.digestSingleChoiceResults(results, metadata))
      .then((results) => {
        const parsedResults: IProcessResults = {
          ...results,
          totalWeightedVotes: countVotesWeight(results),
        }

        setResults(parsedResults)
      })
      .catch((err) => console.log(err))
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
    startDate,
    endDate,
    processId,
    remainingTime,
    statusText,
    results,
    methods: {
      cancelProcess,
      pauseProcess,
      waitUntilStatusUpdated,
      refreshResults
    }
  }
}
