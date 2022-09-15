import { usePool, useProcess, useBlockHeight, useDateAtBlock, UseProcessContext, CacheRegisterPrefix } from '@vocdoni/react-hooks'
import { ProcessDetails, ProcessResultsSingleChoice, VotingApi, ProcessStatus, VochainProcessStatus, IProcessStatus, ProcessState, Voting, CensusOffChainApi } from 'dvote-js'
import { Wallet } from '@ethersproject/wallet'

import { createContext, ReactNode, useContext } from 'react'
import { useEffect, useState } from 'react'

import i18n from '../i18n'

import { DateDiffType, localizedStrDateDiff } from '../lib/date'
import { IProcessResults, VotingType } from '@lib/types'
import { Question } from '@lib/types'
import { VoteStatus } from '@lib/util'
import { MetadataFields } from '@components/pages/votes/new/metadata'
import { BigNumber } from 'ethers'

export interface ProcessWrapperContext {
  loadingInfo: boolean,
  loadingInfoError: string,
  processInfo: ProcessDetails,
  censusSize: number
  hasStarted: boolean,
  hasEnded: boolean,
  remainingTime: string,
  startDate: Date,
  endDate: Date,
  status: VoteStatus
  statusText: string,
  processId: string,
  results: IProcessResults,
  votingType: VotingType,
  votesWeight: BigNumber,
  liveResults: boolean,
  description: string
  liveStreamUrl: string
  discussionUrl: string
  attachmentUrl: string
  questions: Question[]
  title: string
  isAnonymous: boolean
  participationRate: string
  methods: {
    // refreshProcessInfo: (processId: string) => Promise<ProcessDetails>
    refreshResults: () => Promise<any>
    setProcessId: (processId: string) => void
    waitUntilStatusUpdated: (processId: string, status: IProcessStatus) => Promise<ProcessState>
    cancelProcess: (processId: string, wallet: Wallet) => Promise<void>
    pauseProcess: (processId: string, wallet: Wallet) => Promise<void>
  }
}
const UseProcessWrapperContext = createContext<ProcessWrapperContext>({ censusSize: 0, processId: '', methods: {} } as any)


export const useProcessWrapper = (processId: string) => {
  const ctx = useContext(UseProcessWrapperContext)

  if (ctx === null) {
    throw new Error('useProcessWrapper() can only be used on the descendants of <UseProcesWrapperProvider />,')
  }
  useEffect(() => {
    if (!processId) return
    else if (ctx.processId == processId) return

    ctx.methods.setProcessId(processId)
  }, [processId])

  return ctx
}
export const UseProcessWrapperProvider = ({ children }: { children: ReactNode }) => {
  const [processId, setProcessId] = useState("")
  const invalidProcessId = !processId || !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const processContext = useContext(UseProcessContext)
  const [censusSize, setCensusSize] = useState<number>()
  const [participationRate, setParticipationRate] = useState<string>()
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
  const [status, setStatus] = useState<VoteStatus>()

  const startBlock = processInfo?.state?.startBlock || 0
  const endBlock = processInfo?.state?.endBlock || 0
  const startDate = processInfo?.state?.archived ? processInfo?.state?.startDate : useDateAtBlock(startBlock).date
  const endDate = processInfo?.state?.archived ? processInfo?.state?.endDate : useDateAtBlock(endBlock).date

  // Effects

  useEffect(() => {
    if (invalidProcessId) return
    refreshResults()
    refresh(processId)
  }, [processId])

  useEffect(() => {
    updateCensusSize()
  }, [processInfo?.state?.censusRoot, results])

  useEffect(() => {
    // TODO
    // this rate does not support weighted voting
    // we have the total weight of the votes but we dont have
    // total voting power of the census so it cannot be computed
    // properly
    setParticipationRate(((results?.totalVotes || 0) / (censusSize || 1) * 100).toFixed(2))
  }, [censusSize, results])

  useEffect(() => {
    if (invalidProcessId) return
    else if (blockHeight % 3 !== 0) return
    refreshResults()
    refresh(processId)
  }, [blockHeight])

  // STATUS UseEffect
  useEffect(() => {
    switch (processInfo?.state?.status) {
      case VochainProcessStatus.READY:
        if (hasEnded) {
          setStatusText(i18n.t("status.the_vote_has_ended"))
          setStatus(VoteStatus.Ended)
        }
        else if (hasStarted) {
          setStatusText(i18n.t("status.the_vote_is_open_for_voting"))
          setStatus(VoteStatus.Active)
        }
        else if (!hasStarted) {
          setStatusText(i18n.t("status.the_vote_will_start_soon"))
          setStatus(VoteStatus.Upcoming)
        }
        break
      case VochainProcessStatus.PAUSED:
        setStatusText(i18n.t("status.the_vote_is_paused"))
        setStatus(VoteStatus.Paused)
        break
      case VochainProcessStatus.CANCELED:
        setStatusText(i18n.t("status.the_vote_is_canceled"))
        setStatus(VoteStatus.Canceled)
        break
      case VochainProcessStatus.ENDED:
        setStatus(VoteStatus.Ended)
      case VochainProcessStatus.RESULTS:
        setStatusText(i18n.t("status.the_vote_has_ended"))
        setStatus(VoteStatus.Ended)
        break
    }
  }, [processInfo?.state])

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
  const updateCensusSize = async () => {
    try {
      const pool = await poolPromise
      let size = "1"
      if (processInfo?.state?.censusRoot) {
        size = await CensusOffChainApi.getSize(processInfo?.state?.censusRoot, pool)
      }
      setCensusSize(parseInt(size))
    } catch (e) {
      console.error(e)
    }
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

    processContext.invalidateRegister(CacheRegisterPrefix.Summary, processId)
    refresh(processId)
  }

  const pauseProcess = async (processId: string, wallet: Wallet): Promise<void> => {
    await updateProcessStatus(processId, ProcessStatus.ENDED, wallet)

    await waitUntilStatusUpdated(processId, VochainProcessStatus.ENDED)

    processContext.invalidateRegister(CacheRegisterPrefix.Summary, processId)
    refresh(processId)
  }
  // Loaders

  // const countVotesWeight = (results: ProcessResultsSingleChoice): number => {
  //   return results.questions.reduce((prev, curr) => prev + curr.voteResults.reduce((p, c) => p + c.votes.toNumber(), 0), 0) / results.questions.length
  // }
  const countVotesWeight = (results: ProcessResultsSingleChoice): BigNumber => {
    const weightSum = results.questions.reduce((prev, curr) => prev.add(curr.voteResults.reduce((p, c) => c.votes.add(p), BigNumber.from(0))), BigNumber.from(0))
    return weightSum.div(results.questions.length)
  }

  const refreshResults = () => {

    if (!processId || invalidProcessId) return Promise.resolve()

    poolPromise
      .then((pool) => Promise.all([
        VotingApi.getResults(processId, pool),
        VotingApi.getProcessMetadata(processId, pool),
      ]))
      .then(([results, metadata]) => Voting.digestSingleChoiceResults(results, metadata))
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
  const liveResults = !processInfo?.state?.envelopeType?.encryptedVotes
  const votingType: VotingType = processInfo?.state?.censusOrigin as any
  const isAnonymous = processInfo?.state?.envelopeType?.anonymous
  const description = processInfo?.metadata?.description.default
  const liveStreamUrl = processInfo?.metadata?.media.streamUri
  const discussionUrl = processInfo?.metadata?.meta[MetadataFields.DiscussionLink]
  const attachmentUrl = processInfo?.metadata?.meta[MetadataFields.AttachmentLink]
  const questions = processInfo?.metadata?.questions
  const votesWeight = VotingType.Weighted === votingType
    ? results?.totalWeightedVotes
    : results?.totalVotes ? BigNumber.from(results?.totalVotes) : undefined
  const title = processInfo?.metadata?.title.default
  const remainingTime = (startBlock && startDate)
    ? hasStarted
      ? localizedStrDateDiff(DateDiffType.End, endDate)
      : localizedStrDateDiff(DateDiffType.Start, startDate)
    : ''

  // RETURN VALUES
  const value: ProcessWrapperContext = {
    loadingInfo,
    loadingInfoError,
    processInfo,
    censusSize,
    hasStarted,
    hasEnded,
    remainingTime,
    startDate,
    endDate,
    status,
    statusText,
    processId,
    results,
    votingType,
    votesWeight,
    liveResults,
    description,
    liveStreamUrl,
    discussionUrl,
    attachmentUrl,
    questions,
    title,
    isAnonymous,
    participationRate,
    methods: {
      // refreshProcessInfo,
      refreshResults,
      setProcessId,
      waitUntilStatusUpdated,
      cancelProcess,
      pauseProcess
    }
  }
  return (
    <UseProcessWrapperContext.Provider value={value}>
      {children}
    </UseProcessWrapperContext.Provider>
  )
}
