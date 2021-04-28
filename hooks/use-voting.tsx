import { usePool, useProcess } from '@vocdoni/react-hooks'
import { CensusOffChainApi, DigestedProcessResults, ProcessStatus, VotingApi, CensusOffchainDigestType } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet, WalletRoles } from './use-wallet'
import i18n from '../i18n'
import { DEFAULT_VOTING_PAGE_STEP, VotingPageSteps } from '../components/steps-voting'
import { ProcessInfo, StepperFunc } from '../lib/types'
import { useStepper } from './use-stepper'
import { useUrlHash } from 'use-url-hash'
import { useMessageAlert } from './message-alert'
import { DateDiffType, localizedStrDateDiff } from '../lib/date'
import { areAllNumbers, waitBlockFraction } from '../lib/util'

export interface VotingContext {
  pleaseWait: boolean,
  actionStep: number,
  actionError?: string,
  pageStep: VotingPageSteps,
  loadingInfo: boolean,
  loadingInfoError: string,

  processInfo: ProcessInfo,

  hasStarted: boolean,
  hasEnded: boolean,
  remainingTime: string,

  canVote: boolean,
  // isInCensus: boolean,
  allQuestionsChosen: boolean,
  statusText: string,

  invalidProcessId: boolean,
  refreshingVotedStatus: boolean,
  results: DigestedProcessResults,

  // sent: boolean,

  methods: {
    onSelect: (questionIdx: number, choiceValue: number) => void,

    submitVote: () => Promise<void>,
    continueSubmitVote: () => Promise<void>
  }
}

export const UseVotingContext = createContext<VotingContext>({ step: 0, methods: {} } as any)

export const useVoting = () => {
  const votingCtx = useContext(UseVotingContext)
  if (votingCtx === null) {
    throw new Error('useVoting() can only be used on the descendants of <UsevotingProvider />,')
  }
  return votingCtx
}

export const UseVotingProvider = ({ children }: { children: ReactNode }) => {
  const { poolPromise } = usePool()
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { setAlertMessage } = useMessageAlert()
  const processId = useUrlHash().slice(1) // Skip "/"
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-A]{64}$/)
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo } = useProcess(processId)
  const [startDate, setStartDate] = useState(null as Date)
  const [endDate, setEndDate] = useState(null as Date)
  const [nullifier, setNullifier] = useState("")
  const [censusProof, setCensusProof] = useState("")
  const [hasVoted, setHasVoted] = useState(false)
  const [refreshingVotedStatus, setRefreshingVotedStatus] = useState(false)
  const [choices, setChoices] = useState([] as number[])
  const [results, setResults] = useState(null as DigestedProcessResults)

  // Effects

  useEffect(() => {
    let skip = false

    const refreshInterval = setInterval(() => {
      if (skip) return

      Promise.all([
        updateEnvelopeStatus(),
        updateResults()
      ]).catch((err) =>
        console.error(err)
      )
    }, 1000 * 30)

    return () => {
      skip = true
      clearInterval(refreshInterval)
    }
  }, [processId])

  // Vote results
  useEffect(() => {
    updateResults()
  }, [processId])

  // Vote status
  useEffect(() => {
    updateEnvelopeStatus()
  }, [wallet, nullifier])

  // Census status
  useEffect(() => {
    updateCensusStatus()
  }, [wallet, nullifier])

  // Dates
  useEffect(() => {
    updateDates()
  }, [processInfo?.parameters?.startBlock])

  // Nullifier
  useEffect(() => {
    if (!wallet?.address || !processId || invalidProcessId) return

    // Future: adapt to the zk snark case

    const nullifier = VotingApi.getSignedVoteNullifier(wallet.address, processId)
    setNullifier(nullifier)
  }, [wallet?.address, processId])

  // Loaders

  const updateCensusStatus = async () => {
    if (!wallet?.publicKey) return

    try {
      const pool = await poolPromise

      const isDigested = true
      const digestedHexClaim = CensusOffChainApi.digestPublicKey(wallet.publicKey,CensusOffchainDigestType.RAW_PUBKEY)

      const censusProof = await CensusOffChainApi.generateProof(
        processInfo.parameters.censusRoot,
        { key: digestedHexClaim },
        isDigested,
        pool
      )
      if (!censusProof) return setAlertMessage(i18n.t("errors.you_are_not_part_of_the_census"))

      setCensusProof(censusProof)
    } catch (err) {
      return setAlertMessage(i18n.t("errors.could_not_check_the_census"))
    }
  }

  const updateDates = () => {
    if (!processInfo?.parameters?.startBlock) return

    return poolPromise
      .then((pool) =>
        Promise.all([
          VotingApi.estimateDateAtBlock(
            processInfo.parameters.startBlock,
            pool
          ),
          VotingApi.estimateDateAtBlock(
            processInfo.parameters.startBlock + processInfo.parameters.blockCount,
            pool
          ),
        ])
      )
      .then(([startDate, endDate]) => {
        setStartDate(startDate)
        setEndDate(endDate)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const updateEnvelopeStatus = () => {
    if (!processId || invalidProcessId || !nullifier) return
    setRefreshingVotedStatus(true)

    poolPromise
      .then((pool) =>
        VotingApi.getEnvelopeStatus(processId, nullifier, pool)
      )
      .then(({ registered }) => {
        setRefreshingVotedStatus(false)
        setHasVoted(registered)
      })
      .catch((err) => {
        setRefreshingVotedStatus(false)
        console.error(err)
      })
  }

  const updateResults = () => {
    if (!processId || invalidProcessId) return

    poolPromise
      .then((pool) => VotingApi.getResultsDigest(processId, pool))
      .then((results) => setResults(results))
      .catch((err) => console.error(err))
  }

  // Callbacks

  const onSelect = (questionIdx: number, choiceValue: number) => {
    if (typeof choiceValue == 'string') choiceValue = parseInt(choiceValue)
    if (isNaN(choiceValue))
      return setAlertMessage('Invalid question value')

    choices[questionIdx] = choiceValue
    setChoices([].concat(choices))
  }

  // MAIN ACTION STEPS

  const confirmAction: StepperFunc = () => {
    const confirmed = confirm(
      i18n.t("confirm.you_are_about_to_submit_your_vote") + ". " +
      i18n.t("confirm.this_action_cannot_be_undone") + ".\n\n" +
      i18n.t("confirm.do_you_want_to_continue")
    )
    if (!confirmed) return Promise.resolve({ error: i18n.t("errors.you_canceled_the_operation") })
    return Promise.resolve({})
  }

  const ensureCensusProof: StepperFunc = () => {
    if (censusProof) return Promise.resolve({})

    return updateCensusStatus()
      .then(() => {
        return { waitNext: true }
      })
  }

  const ensureVoteSubmission: StepperFunc = async () => {
    try {
      const pool = await poolPromise

      // Detect encryption
      if (processInfo.parameters.envelopeType.hasEncryptedVotes) {
        const processKeys = await VotingApi.getProcessKeys(processId, pool)
        const envelope = await VotingApi.packageSignedEnvelope({ censusOrigin: processInfo.parameters.censusOrigin, votes: choices, censusProof, processId, walletOrSigner: wallet, processKeys })
        await VotingApi.submitEnvelope(envelope, wallet, pool)
      }
      else {
        const envelope = await VotingApi.packageSignedEnvelope({ censusOrigin: processInfo.parameters.censusOrigin, votes: choices, censusProof, processId, walletOrSigner: wallet })
        await VotingApi.submitEnvelope(envelope, wallet, pool)
      }

      return { waitNext: false }
    } catch (err) {
      console.error(err)
      return { error: i18n.t("errors.your_vote_could_not_be_delivered") }
    }
  }

  const ensureVoteInclusion: StepperFunc = async () => {
    try {
      const pool = await poolPromise

      // wait a block
      await waitBlockFraction(1.2)

      let voted = false
      for (let i = 0; i < 30; i++) {
        const { registered, date } = await VotingApi.getEnvelopeStatus(
          processId,
          nullifier,
          pool
        )
        if (registered) {
          voted = true
          setHasVoted(true)
          break
        }
        // keep waiting
        await waitBlockFraction(1.1)
      }
      if (!voted) return { error: i18n.t("errors.the_vote_has_not_been_registered") }

      // detached update
      setTimeout(() => {
        updateResults()
        updateEnvelopeStatus()
      })

      setAlertMessage(i18n.t("vote.your_vote_has_been_successfully_registered"))
      setHasVoted(true)
    } catch (err) {
      console.error(err)
      return { error: i18n.t("errors.the_vote_has_not_been_registered") }
    }
  }

  // Enumerate all the steps needed to create an entity
  const creationStepFuncs = [confirmAction, ensureCensusProof, ensureVoteSubmission, ensureVoteInclusion]

  const creationStepper = useStepper(creationStepFuncs, DEFAULT_VOTING_PAGE_STEP)
  const { actionStep, pleaseWait, creationError, doMainActionSteps } = creationStepper

  // Render precomputed params

  const allQuestionsChosen =
    areAllNumbers(choices) &&
    choices.length == processInfo?.metadata?.questions?.length
  const hasStarted = startDate && startDate.getTime() <= Date.now()
  const hasEnded = endDate && endDate.getTime() < Date.now()
  const isInCensus = !!censusProof

  const canVote = processInfo && nullifier && isInCensus && !hasVoted && hasStarted && !hasEnded

  const remainingTime = startDate
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
  const value: VotingContext = {
    pageStep: VotingPageSteps.VOTE,
    actionStep,
    pleaseWait,
    actionError: creationError,
    loadingInfoError,
    invalidProcessId,
    loadingInfo,
    refreshingVotedStatus,
    processInfo,

    hasStarted,
    hasEnded,
    // isInCensus,

    canVote,
    remainingTime,
    allQuestionsChosen,
    statusText,

    results,

    methods: {
      onSelect,

      submitVote: doMainActionSteps,
      continueSubmitVote: doMainActionSteps
    }
  }

  return (
    <UseVotingContext.Provider value={value}>
      {children}
    </UseVotingContext.Provider>
  )
}
