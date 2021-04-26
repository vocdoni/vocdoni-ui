import { usePool, useProcess } from '@vocdoni/react-hooks'
import { CensusOffChainApi, DigestedProcessResults, ProcessStatus, VotingApi } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet, WalletRoles } from './use-wallet'
import i18n from '../i18n'
import { VotingPageSteps } from '../components/steps-voting'
import { ProcessInfo, StepperFunc } from '../lib/types'
import { useStepper } from './use-stepper'
import { useUrlHash } from 'use-url-hash'
import { useMessageAlert } from './message-alert'
import { DateDiffType, strDateDiff } from '../lib/date'
import { areAllNumbers } from '../lib/util'

export interface VotingContext {
  pleaseWait: boolean,
  actionStep: number,
  actionError?: string,
  pageStep: VotingPageSteps,
  loadingInfo: boolean,
  loadingInfoError: string,
  votingError: string,

  processInfo: ProcessInfo,

  hasStarted: boolean,
  hasEnded: boolean,
  isInCensus: boolean,

  canVote: boolean,
  remainingTime: string,
  allQuestionsChosen: boolean,
  statusText: string,

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
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const processId = useUrlHash().slice(1) // Skip /
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-A]{64}$/)
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo } = useProcess(processId)
  const [startDate, setStartDate] = useState(null as Date)
  const [endDate, setEndDate] = useState(null as Date)
  const { setAlertMessage } = useMessageAlert()
  const [censusProof, setCensusProof] = useState(
    null as { key: string, proof: string[], value: string }
  )
  const [hasVoted, setHasVoted] = useState(false)
  const [refreshingVotedStatus, setRefreshingVotedStatus] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [choices, setChoices] = useState([] as number[])
  const [results, setResults] = useState(null as DigestedProcessResults)

  const nullifier = VotingApi.getSignedVoteNullifier(
    wallet?.address || '',
    processId
  )

  // Effects

  useEffect(() => {
    let skip = false

    const refreshInterval = setInterval(() => {
      if (skip) return

      Promise.all([updateVoteStatus(), updateResults()]).catch((err) =>
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
    updateVoteStatus()
  }, [wallet, nullifier])

  // Census status
  useEffect(() => {
    updateCensusStatus()
  }, [wallet, nullifier, processInfo?.entity])

  // Dates
  useEffect(() => {
    updateDates()
  }, [processInfo?.parameters?.startBlock])

  // Loaders
  const updateVoteStatus = () => {
    if (!processId || !nullifier) return
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
    if (!processId) return

    poolPromise
      .then((pool) => VotingApi.getResultsDigest(processId, pool))
      .then((results) => setResults(results))
      .catch((err) => console.error(err))
  }

  const updateCensusStatus = async () => {
    // TODO: ADAPT TO OFFCHAIN CENSUS

    // if (!wallet?.address) {
    //   setCensusProof(null)
    //   return
    // }

    // const pool = await poolPromise

    // if (!(await CensusErc20Api.isRegistered(token.address, pool))) {
    //   setTokenRegistered(false)
    //   return setAlertMessage('The token contract is not yet registered')
    // } else if (tokenRegistered !== true) setTokenRegistered(true)

    // const processEthCreationBlock = processInfo.parameters.evmBlockHeight
    // const balanceSlot = CensusErc20Api.getHolderBalanceSlot(
    //   wallet.account,
    //   token.balanceMappingPosition
    // )

    // const proofFields = await CensusErc20Api.generateProof(
    //   token.address,
    //   [balanceSlot],
    //   processEthCreationBlock,
    //   pool.provider as providers.JsonRpcProvider
    // )

    // setCensusProof(proofFields.proof.storageProof[0])
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

  // Callbacks

  const onSelect = (questionIdx: number, choiceValue: number) => {
    if (typeof choiceValue == 'string') choiceValue = parseInt(choiceValue)
    if (isNaN(choiceValue))
      return setAlertMessage('Invalid question value')

    choices[questionIdx] = choiceValue
    setChoices([].concat(choices))
  }

  // MAIN ACTION STEPS

  const ensureMerkleProof: StepperFunc = () => {
    // if (wallet) {
    //   // Already OK?
    //   return Promise.resolve({ waitNext: false })
    // }
    // if (!entityAddress) return Promise.reject({ error: i18n.t('error.missing_entity_address') })

    // if (loadingInfoError) return Promise.reject({ error: i18n.t('error.cannot_load_process') })

    return poolPromise
      .then(pool => {

        return CensusOffChainApi.generateProof(
          process.parameters.censusRoot,
          { key: digestedHexClaim },
          true,
          pool)
      })
      .then(merkleProof => {
        if (merkleProof) return { waitNext: false }
        return { error: i18n.t('error.invalid_login') }
      })
  }

  const ensureVoteDelivery: StepperFunc = () => {
    // TODO: ADAPT TO OFFCHAIN CENSUS

    //     if (
    //       !confirm(
    //         'You are about to submit your vote. This action cannot be undone.\n\nDo you want to continue?'
    //       )
    //     )
    //       return

    //     try {
    //       setIsSubmitting(true)

    //       const pool = await poolPromise

    //       // Census Proof
    //       const holderAddr = wallet.account
    //       const processEthCreationBlock = processInfo.parameters.evmBlockHeight
    //       const balanceSlot = CensusErc20Api.getHolderBalanceSlot(
    //         holderAddr,
    //         token.balanceMappingPosition
    //       )
    //       const { proof } = await CensusErc20Api.generateProof(
    //         token.address,
    //         [balanceSlot],
    //         processEthCreationBlock,
    //         pool.provider as providers.JsonRpcProvider
    //       )

    //       // Detect encryption
    //       if (processInfo.parameters.envelopeType.hasEncryptedVotes) {
    //         const keys = await VotingApi.getProcessKeys(processId, pool)
    //         const envelope = await VotingApi.packageSignedEnvelope({
    //           votes: choices,
    //           censusOrigin: processInfo.parameters.censusOrigin,
    //           censusProof: proof.storageProof[0],
    //           processId,
    //           walletOrSigner: signer,
    //           processKeys: keys,
    //         })
    //         await VotingApi.submitEnvelope(envelope, signer, pool)
    //       } else {
    //         const envelope = await VotingApi.packageSignedEnvelope({
    //           votes: choices,
    //           censusOrigin: processInfo.parameters.censusOrigin,
    //           censusProof: proof.storageProof[0],
    //           processId,
    //           walletOrSigner: signer,
    //         })
    //         await VotingApi.submitEnvelope(envelope, signer, pool)
    //       }

    //       // wait a block
    //       await new Promise((resolve) =>
    //         setTimeout(
    //           resolve,
    //           Math.floor(parseInt(process.env.BLOCK_TIME) * 1000 * 1.2)
    //         )
    //       )

    //       let voted = false
    //       for (let i = 0; i < 10; i++) {
    //         const { registered, date } = await VotingApi.getEnvelopeStatus(
    //           processId,
    //           nullifier,
    //           pool
    //         )
    //         voted = registered
    //         setHasVoted(voted)

    //         if (registered) break
    //         await new Promise((resolve) =>
    //           setTimeout(
    //             resolve,
    //             Math.floor(parseInt(process.env.BLOCK_TIME) * 500)
    //           )
    //         )
    //       }
    //       if (!voted) throw new Error('The vote has not been registered')

    //       // detached update
    //       setTimeout(() => {
    //         updateResults()
    //         updateVoteStatus()
    //       })

    //       setAlertMessage('Your vote has been sucessfully submitted')
    //       setHasVoted(true)
    //       setIsSubmitting(false)
    //     } catch (err) {
    //       console.error(err)
    //       setIsSubmitting(false)
    //       setAlertMessage('The delivery of your vote could not be completed')
    //     }
  }

  // Enumerate all the steps needed to create an entity
  const creationStepFuncs = [ensureMerkleProof, ensureVoteDelivery]

  const creationStepper = useStepper(creationStepFuncs, 0)
  const { actionStep, pleaseWait, creationError, doMainActionSteps } = creationStepper

  // Render precomputed params

  const allQuestionsChosen =
    areAllNumbers(choices) &&
    choices.length == processInfo?.metadata?.questions?.length
  const hasStarted = startDate && startDate.getTime() <= Date.now()
  const hasEnded = endDate && endDate.getTime() < Date.now()
  const isInCensus = !!censusProof

  const canVote =
    processInfo &&
    isInCensus &&
    !hasVoted &&
    hasStarted &&
    !hasEnded

  const remainingTime = startDate
    ? hasStarted
      ? strDateDiff(DateDiffType.End, endDate)
      : strDateDiff(DateDiffType.Start, startDate)
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
    actionStep,
    pleaseWait,
    actionError: creationError,
    loadingInfoError,
    loadingInfo,
    processInfo,

    hasStarted,
    hasEnded,
    isInCensus,

    canVote,
    remainingTime,
    allQuestionsChosen,
    statusText,

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
