import { usePool, useBlockHeight } from '@vocdoni/react-hooks'
import { ProcessDetails, CensusOffChain, CensusOffChainApi, AnonymousEnvelopeParams, VotingApi, Voting, ZkInputs, ZkSnarks, Keccak256, Poseidon, CensusOnChainApi, Symmetric } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'

import { useWallet, WalletRoles } from './use-wallet'
import i18n from '../i18n'
import { CensusPoof, IProcessResults, StepperFunc, Voter, ZKCensusPoof } from '../lib/types'
import { useStepper } from './use-stepper'
import { useMessageAlert } from './message-alert'
import { areAllNumbers, waitBlockFraction, calculateAnonymousKey } from '../lib/util'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ZKcensusProofState } from '@recoil/atoms/zk-census-proof'
import { useDbVoters } from './use-db-voters'


export interface VotingContext {
  pleaseWait: boolean,
  actionStep: number,
  actionError?: string,
  loadingInfo: boolean,
  loadingInfoError: string,

  processInfo: ProcessDetails,

  hasStarted: boolean,
  hasEnded: boolean,
  remainingTime: string,
  hasVoted: boolean,
  canVote: boolean,
  choices: number[],
  allQuestionsChosen: boolean,
  statusText: string,
  processId: string,
  nullifier: string | bigint,
  explorerLink: string,
  invalidProcessId: boolean,
  refreshingVotedStatus: boolean,
  results: IProcessResults,

  // sent: boolean,

  methods: {
    setProcessId: (processId: string) => void,
    onSelect: (questionIdx: number, choiceValue: number) => void,
    cleanup: () => void,
    setAnonymousKey,

    submitVote: () => Promise<void>,
    continueSubmitVote: () => Promise<void>
  }
}

export const UseVotingContext = createContext<VotingContext>({ step: 0, methods: {} } as any)

export const useVoting = (processId: string) => {
  const votingCtx = useContext(UseVotingContext)

  if (votingCtx === null) {
    throw new Error('useVoting() can only be used on the descendants of <UsevotingProvider />,')
  }
  useEffect(() => {
    if (!processId) return
    else if (votingCtx.processId == processId) return

    votingCtx.methods.setProcessId(processId)
  }, [processId])

  return votingCtx
}

export const UseVotingProvider = ({ children }: { children: ReactNode }) => {
  const { poolPromise } = usePool()
  const [processId, setProcessId] = useState("")
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const {
    loadingInfoError,
    loadingInfo,
    processInfo,
    hasStarted,
    hasEnded,
    remainingTime,
    statusText,
    results,
    methods
  } = useProcessWrapper(processId)
  const [anonymousKey, setAnonymousKey] = useState<bigint>()
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { setAlertMessage } = useMessageAlert()
  const { blockHeight } = useBlockHeight()
  const [nullifier, setNullifier] = useState<string | bigint>()
  const [explorerLink, setExplorerLink] = useState<string>()
  const [censusProof, setCensusProof] = useState<CensusPoof>()
  const [hasVoted, setHasVoted] = useState(false)
  const [refreshingVotedStatus, setRefreshingVotedStatus] = useState(false)
  const [choices, setChoices] = useState([] as number[])
  const [censusProofZK, _] = useRecoilState(ZKcensusProofState)
  const setZKCensusProof = useSetRecoilState<ZKCensusPoof>(ZKcensusProofState)
  const { getVoter } = useDbVoters()
  const [voterDbEntry, setVoterDbEntry] = useState<Voter>()


  // Effects

  // Vote status
  useEffect(() => {
    updateEnvelopeStatus()
  }, [processId, wallet, nullifier, blockHeight])


  // Census status
  useEffect(() => {
    updateCensusStatus().catch(() => { })
  }, [nullifier, processInfo?.state?.censusRoot])

  // Nullifier
  useEffect(() => {
    if (!wallet?.address || !processId || invalidProcessId) return

    if (wallet?.address && processId && !voterDbEntry) {
      let voter = getVoter(wallet.address,processId)
      if (voter) {
        setVoterDbEntry(voter)
      }

    }
    // Future: adapt to the zk snark case
    let nullifier: string | bigint
    const baseExplorerLink = process.env.EXPLORER_URL + '/envelopes/show/#/'
    if (processInfo?.state?.envelopeType.anonymous) {
      if (!anonymousKey) return
      nullifier = Voting.getAnonymousVoteNullifier(anonymousKey, processId)
      setNullifier(nullifier)
      setExplorerLink(baseExplorerLink + Voting.getAnonymousHexNullifier(anonymousKey, processId, true))
    } else {
      nullifier = Voting.getSignedVoteNullifier(wallet.address, processId)
      setNullifier(nullifier)
      setExplorerLink(baseExplorerLink + nullifier)
    }

  }, [wallet?.address, processId, anonymousKey, hasVoted])

  // Loaders

  const updateCensusStatus = async () => {
    if (!wallet?.publicKey) return
    else if (!processInfo?.state?.censusRoot) return

    try {
      const pool = await poolPromise

      const digestedHexClaim = CensusOffChain.Public.encodePublicKey(wallet.publicKey)

      const censusProof = await CensusOffChainApi.generateProof(
        processInfo.state?.censusRoot,
        { key: digestedHexClaim },
        pool
      )
      if (!censusProof) return setAlertMessage(i18n.t("errors.you_are_not_part_of_the_census"))

      setCensusProof(censusProof)
    } catch (err) {
      setAlertMessage(i18n.t("errors.could_not_check_the_census"))
      throw err
    }
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

  // Callbacks

  const onSelect = (questionIdx: number, choiceValue: number) => {
    if (typeof choiceValue == 'string') choiceValue = parseInt(choiceValue)
    if (isNaN(choiceValue))
      return setAlertMessage('Invalid question value')

    choices[questionIdx] = choiceValue
    setChoices([].concat(choices))
  }

  const cleanup = () => {
    creationStepper.resetActionStep()
    setNullifier("")
    setCensusProof(null)
    setZKCensusProof(null)
    setAnonymousKey(null)
    setHasVoted(false)
    setChoices([])
    setRefreshingVotedStatus(false)
  }

  // MAIN ACTION STEPS

  // const confirmAction: StepperFunc = () => {
  //   const confirmed = confirm(
  //     i18n.t("confirm.you_are_about_to_submit_your_vote") + ". " +
  //     i18n.t("confirm.this_action_cannot_be_undone") + ".\n\n" +
  //     i18n.t("confirm.do_you_want_to_continue")
  //   )
  //   if (!confirmed) Promise.reject(new Error(i18n.t("errors.you_canceled_the_operation")))
  //   return Promise.resolve({})
  // }

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

      let processKeys = null
      // Detect encryption
      if (processInfo.state?.envelopeType.encryptedVotes) {
        processKeys = await VotingApi.getProcessKeys(processId, pool)
      }

      if (processInfo.state?.envelopeType?.anonymous) {
        let anonymousKeyTemp = anonymousKey
        if (!anonymousKeyTemp) {
          // const voter = getVoter(wallet.address,processId)
          if (!voterDbEntry || !voterDbEntry.encrAnonKey) {
            console.error("missing anonymous key")
            return { error: i18n.t("errors.your_vote_could_not_be_delivered") }
          }
          const plainAnonKey = Symmetric.decryptString(voterDbEntry.encrAnonKey,wallet.privateKey)
          anonymousKeyTemp = calculateAnonymousKey(wallet.privateKey, plainAnonKey, processInfo?.state?.entityId)
          setAnonymousKey(anonymousKeyTemp)
        }
        await anonymousVote(anonymousKeyTemp, choices, processId, processKeys, pool)
      } else {
        const envelope = await Voting.packageSignedEnvelope({
          censusOrigin: processInfo.state?.censusOrigin,
          votes: choices,
          censusProof,
          processId,
          processKeys
        })
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
        updateEnvelopeStatus()
        methods.refreshResults()
      }, 100)

      setHasVoted(true)
      setChoices([])
    } catch (err) {
      console.error(err)
      return { error: i18n.t("errors.the_vote_has_not_been_registered") }
    }
  }

  // Enumerate all the steps needed to create an entity
  const creationStepFuncs = [ensureCensusProof, ensureVoteSubmission, ensureVoteInclusion]

  const creationStepper = useStepper(creationStepFuncs, '')
  const { actionStep, pleaseWait, creationError, doMainActionSteps } = creationStepper

  // Render precomputed params

  const allQuestionsChosen =
    areAllNumbers(choices) &&
    choices.length == processInfo?.metadata?.questions?.length
  // const hasStarted = startDate && startDate.getTime() <= Date.now()
  // const hasEnded = endDate && endDate.getTime() < Date.now()
  const isInCensus = !!censusProof

  const canVote = processInfo && nullifier && isInCensus && !hasVoted && hasStarted && !hasEnded




  const anonymousVote = async (secretKey, choices, processId, processKeys, pool) => {
    const state = await VotingApi.getProcessState(processId, pool)
    let censusProofZKtemp = censusProofZK
    if (!censusProofZKtemp) {
      censusProofZKtemp = await CensusOnChainApi.generateProof(state.rollingCensusRoot, secretKey, pool)
      setZKCensusProof(censusProofZKtemp)
    }

    const circuitInfo = await VotingApi.getProcessCircuitInfo(processId, pool)
    const witnessGeneratorWasm = await VotingApi.fetchAnonymousWitnessGenerator(circuitInfo)
    const zKey = await VotingApi.fetchAnonymousVotingZKey(circuitInfo)

    // Prepare ZK Proof
    const nullifier = Voting.getAnonymousVoteNullifier(secretKey, processId)
    const { votePackage, keyIndexes } = Voting.packageVoteContent(choices, processKeys)

    const inputs: ZkInputs = {
      censusRoot: state.rollingCensusRoot,
      censusSiblings: censusProofZKtemp.siblings,
      maxSize: circuitInfo.maxSize,
      keyIndex: censusProofZKtemp.index,
      nullifier,
      secretKey: secretKey,
      processId: Voting.getSnarkProcessId(processId),
      votePackage
    }

    const zkProof = await ZkSnarks.computeProof(inputs, witnessGeneratorWasm, zKey)
    // Only for verifying
    // const vKey = await VotingApi.fetchAnonymousVotingVerificationKey(circuitInfo)
    // const verifyProof = await ZkSnarks.verifyProof(JSON.parse(Buffer.from(vKey).toString()), zkProof.publicSignals as any, zkProof.proof as any)

    zkProof.publicSignals = [nullifier.toString()]

    const envelopeParams: AnonymousEnvelopeParams = {
      votePackage,
      processId,
      zkProof,
      nullifier,
      circuitIndex: circuitInfo.index,
      encryptionKeyIndexes: keyIndexes
    }

    // Package and submit
    const envelope = Voting.packageAnonymousEnvelope(envelopeParams)

    return VotingApi.submitEnvelope(envelope, null, pool)
  }


  // RETURN VALUES
  const value: VotingContext = {
    actionStep,
    pleaseWait,
    actionError: typeof creationError == "string" ? creationError : creationError?.message,
    loadingInfoError,
    invalidProcessId,
    loadingInfo,
    refreshingVotedStatus,
    processInfo,
    hasVoted,
    hasStarted,
    hasEnded,
    nullifier,
    explorerLink,
    processId,
    canVote,
    remainingTime,
    choices,
    allQuestionsChosen,
    statusText,

    results,

    methods: {
      setProcessId,
      onSelect,
      cleanup,
      setAnonymousKey,

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
