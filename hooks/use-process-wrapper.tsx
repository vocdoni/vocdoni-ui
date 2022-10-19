import { usePool, useProcess, useBlockHeight, useDateAtBlock, UseProcessContext, CacheRegisterPrefix } from '@vocdoni/react-hooks'
import { ProcessDetails, ProcessResultsSingleChoice, VotingApi, ProcessStatus, VochainProcessStatus, IProcessStatus, ProcessState, Voting, CensusOffChainApi, ensure0x, ProcessMetadata, RawResults } from 'dvote-js'
import { GatewayArchive, GatewayArchiveApi } from "@vocdoni/client"
import { Wallet } from '@ethersproject/wallet'

import { createContext, ReactNode, useContext } from 'react'
import { useEffect, useState } from 'react'

import i18n from '../i18n'

import { addOffsetToDate, DateDiffType, localizedStrDateDiff, strDiffFuture } from '../lib/date'
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
  participationRate: string,
  archived: boolean,
  totalVotes: number,
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
    loading,
    error: loadingInfoError,
    process,
    refresh,
  } = useProcess(processId)
  const [processInfo, setProcessInfo] = useState<ProcessDetails>(process)
  const [shouldConsultArchive, setShouldConsultArchive] = useState(false)
  const [archiveProcessState, setArchiveProcessState] = useState<ProcessStatus>(null)
  const [archiveResults, setArchiveResults] = useState<RawResults>(null)
  const [consultedArchive, setConsultedArchive] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(loading)
  const [loadingArchive, setLoadingArchive] = useState(false)

  const [results, setResults] = useState<IProcessResults>(null)
  const [statusText, setStatusText] = useState('')
  const [status, setStatus] = useState<VoteStatus>()

  const startBlock = processInfo?.state?.startBlock || 0
  const endBlock = processInfo?.state?.endBlock || 0
  const startDate = (processInfo?.state?.archived || consultedArchive) ? processInfo?.state?.startDate : useDateAtBlock(startBlock).date
  const endDate = (processInfo?.state?.archived || consultedArchive) ? processInfo?.state?.endDate : useDateAtBlock(endBlock).date
  const realTimeResults = processInfo?.state?.envelopeType?.encryptedVotes != true
  const resultsAvailable = realTimeResults || processInfo?.state?.status === VochainProcessStatus.RESULTS
  // Effects

  useEffect(() => {
    setLoadingInfo(loading && loadingArchive)
  }, [loading, loadingArchive])

  useEffect(() => {
    if (loadingArchive || consultedArchive) return
    fetchMetadata(process)
  }, [process])

  useEffect(() => {
    if (invalidProcessId) return
    if (resultsAvailable) refreshResults()
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
    setParticipationRate((censusSize != -1) ? (((results?.totalVotes || 0) / (censusSize || 1) * 100).toFixed(2)) : "0")
  }, [censusSize, results])

  useEffect(() => {
    if (invalidProcessId) return
    else if (blockHeight % 3 !== 0) return
    if (resultsAvailable) refreshResults()
    refresh(processId)
  }, [blockHeight])

  // STATUS UseEffect
  useEffect(() => {
    //TODO check if the process was created in the old prod chain (substancially higher blocknumbers)
    if (!shouldConsultArchive && !chainMismatch(processInfo?.state)) {
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
      refreshResults()
    } else {
      retrieveArchiveInfo()
    }
  }, [processInfo?.state])

  const fetchMetadata = (process: ProcessDetails) => {
    if (!process) return null
    return poolPromise
      .then((pool) => VotingApi.getProcessMetadata(process.id, pool))
      .then((metadata) => {
        if (metadata) {
          let tempProcessInfo = process
          tempProcessInfo.metadata = metadata
          setProcessInfo(tempProcessInfo)
          return
        }
        setProcessInfo(process)
      })
  }


  const chainMismatch = (state: ProcessState) => {
    if (!state || !startDate) return false
    if (state.archived) return false
    let creationDate = new Date(state.creationTime)
    // let startDate =  useDateAtBlock(state.startBlock).date
    let diff = (startDate.getTime() - creationDate.getTime()) / 1000
    let sixMonthDiff = (addOffsetToDate(new Date(), 120).getTime() - startDate.getTime()) / 1000
    //TODO This checks if the blocknumber and creation date repsresent
    // the old prod chain (substancially higher blocknumbers)
    if (sixMonthDiff < 0 && creationDate.getTime() < (new Date("2022-10-18").getTime())) {
      setShouldConsultArchive(true)
      return true
    }
    return false
  }

  const retrieveArchiveInfo = () => {
    return getProcessfromArchive()
      .then((response) => {
        let tempProcessInfo = process
        tempProcessInfo.state = response.procState
        if (!consultedArchive) {
          setProcessInfo(tempProcessInfo)
          setConsultedArchive(true)
        }
        setStatusText(i18n.t("status.the_vote_has_ended"))
        setStatus(VoteStatus.Ended)
        refreshResults(true)
      })
  }

  // const getProcessfromArchive = (): Promise<{procState:ProcessState,results:IProcessResults}> => {
  const getProcessfromArchive = (): Promise<{ procState: ProcessState }> => {
    setLoadingArchive(true)
    return poolPromise
      .then((pool) =>
        GatewayArchiveApi.getProcess(processId, pool.activeGateway, '')
          .then(processArchiveData => {
            let archiveProcess = GatewayArchive.mapToGetProcess(processArchiveData)
            let procState: ProcessState = archiveProcess.process
            const { results, state, height } = GatewayArchive.mapToGetResults(processArchiveData)
            procState.censusRoot = ensure0x(procState.censusRoot)
            procState.entityId = ensure0x(procState.entityId)
            procState.processId = ensure0x(procState.processId)
            setArchiveResults({ results, envelopHeight: height, status: 5 })
            setLoadingArchive(false)
            // return {procState, results:parsedResults}
            return { procState }
          }))
  }

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
    let size = "-1"
    try {
      const pool = await poolPromise
      if (processInfo?.state?.censusRoot) {
        size = await CensusOffChainApi.getSize(processInfo?.state?.censusRoot, pool)
      }
    } catch (e) {
      console.error(e)
    }
    setCensusSize(parseInt(size))
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

  const refreshResults = (triggeredfromArchive?: boolean) => {

    // if (!processId || invalidProcessId || consultedArchive) return Promise.resolve()
    if (!processId || invalidProcessId) return Promise.resolve()

    poolPromise
      .then((pool) => Promise.all([
        (consultedArchive || triggeredfromArchive)
          ? new Promise<RawResults>((resolve, reject) => { resolve(archiveResults) })
          : VotingApi.getResults(processId, pool),
        (processInfo.metadata)
          ? new Promise<ProcessMetadata>((resolve, reject) => { resolve(processInfo.metadata) })
          : VotingApi.getProcessMetadata(processId, pool)
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
  const hasEnded = endDate && endDate.getTime() < Date.now() || processInfo?.state.status >= VochainProcessStatus.ENDED
  const liveResults = !processInfo?.state?.envelopeType?.encryptedVotes
  const votingType: VotingType = processInfo?.state?.censusOrigin as any
  const isAnonymous = processInfo?.state?.envelopeType?.anonymous
  const description = processInfo?.metadata?.description.default
  const liveStreamUrl = processInfo?.metadata?.media.streamUri
  const discussionUrl = processInfo?.metadata?.meta?.[MetadataFields.DiscussionLink]
  const attachmentUrl = processInfo?.metadata?.meta?.[MetadataFields.AttachmentLink]
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
  const archived = processInfo?.state?.archived || false
  let totalVotes = results?.totalVotes || 0
  totalVotes = votesWeight ? votesWeight.toNumber() : totalVotes
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
    archived,
    totalVotes,
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
