import { usePool } from '@vocdoni/react-hooks'
import {
  CensusOffChainApi,
  ProcessContractParameters,
  ProcessEnvelopeType,
  ProcessMetadata,
  ProcessMetadataTemplate,
  ProcessMode,
  VotingApi,
} from 'dvote-js'
import { createContext, useContext, useState } from 'react'
import { VoteCreationSteps } from '../components/steps-new-vote'
import { forceUpdate } from "../hooks/force-update"
import i18n from '../i18n'
import { uploadFileToIpfs } from '../lib/file'
import { StepperFunc, StepperFuncResult } from '../lib/types'
import { extractDigestedPubKeyFromString, importedRowToString } from '../lib/util'
import { useStepper } from './use-stepper'
import { useWallet } from './use-wallet'

export interface VoteCreationContext {
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  pageStep: VoteCreationSteps,
  methods: {
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setMode: (mode: ProcessMode) => void
  },
}

export const UseVoteCreationContext = createContext<VoteCreationContext>({} as any)

export const useVoteCreation = () => {
  const voteCtx = useContext(UseVoteCreationContext)
  if (voteCtx === null) {
    throw new Error('useAccount() can only be used on the descendants of <UseVoteCreationProvider />,')
  }

  return voteCtx
}

export const UseVoteCreationProvider = ({ children }) => {
  const [metadata, setMetadata] = useState<ProcessMetadata>(() => JSON.parse(JSON.stringify(ProcessMetadataTemplate)))
  const [headerUrl, setHeaderUrl] = useState<string>("")
  const [spreadsheetData, setSpreadsheetData] = useState<string[][]>()
  const [headerFile, setHeaderFile] = useState<File>()
  const { wallet } = useWallet()
  const { pool, poolPromise } = usePool()
  const [parameters, setParameters] = useState<ProcessContractParameters>(() => {
    const defValue = new ProcessContractParameters()
    defValue.mode = new ProcessMode(ProcessMode.make({ autoStart: true }))
    defValue.envelopeType = new ProcessEnvelopeType(ProcessEnvelopeType.make({ encryptedVotes: false }))
    defValue.paramsSignature = '0x000000000000000000000'
    return defValue
  })

  // meta
  const setTitle = (title: string) => {
    setMetadata({ ...metadata, title: { default: title } })
  }
  const setDescription = (description: string) => {
    setMetadata({ ...metadata, description: { default: description } })
  }
  // TODO: complete

  // params (we need to use forceUpdate, since the reference cannot be changed unless creating a new instance and copying everything)
  const setMode = (mode: ProcessMode) => {
    if (parameters.mode == mode) return
    parameters.mode = mode
    forceUpdate()
  }

  const censusCreation: StepperFunc = async () => {
    const name = metadata.title.default + '_' + Math.floor(Date.now() / 1000)
    const claims = await Promise.all(spreadsheetData.map((row) => new Promise((resolve) => {
      setTimeout(() =>
        resolve({
          key: extractDigestedPubKeyFromString(importedRowToString(row, wallet.address)).digestedHexClaim,
        })
        , 50)
    }))) as { key: string, value?: string }[]
    const { censusId } = await CensusOffChainApi.addCensus(name, [wallet._signingKey().publicKey], wallet, pool)
    const { censusRoot, invalidClaims } = await CensusOffChainApi.addClaimBulk(censusId, claims, true, wallet, pool)
    if (invalidClaims.length) {
      return {error: i18n.t('error.invalid_claims_found', {total: invalidClaims.length})}
    }
    const censusUri = await CensusOffChainApi.publishCensus(censusId, wallet, pool)
    parameters.censusRoot = censusRoot
    parameters.censusUri = censusUri
    // parameters.startBlock =
    // parameters.blockCount =
    // metadata.meta.formUri =
  }

  const processCreation: StepperFunc = (): Promise<StepperFuncResult> => {
    return poolPromise
      .then(async (pool) => {
        metadata.media.header = headerUrl
        if (headerFile) {
          metadata.media.header = await uploadFileToIpfs(headerFile, pool, wallet)
        }
        // ProcessContractParameters !== INewProcessParams
        parameters.metadata = metadata
        // Set proper maxValue and maxCount
        let maxValue = 0, maxCount = 0
        metadata.questions.forEach((question) => {
            if (maxValue < question.choices.length) {
                maxValue = question.choices.length
            }
            maxCount++
        })
        parameters.maxValue = maxValue
        parameters.maxCount = maxCount

        return pool
      })
      .then(async (pool) => {
        // ProcessContractParameters !== INewProcessParams
        await VotingApi.newProcess(parameters.toContractParams(), wallet, pool)

        return {
          waitNext: false,
        }
      })
      .catch((error) => {
        console.error(error)
        return { error }
      })
  }

  const creationStepFuncs = [
    censusCreation,
    processCreation,
  ]

  const {
    pageStep,
    actionStep,
    pleaseWait,
    creationError,
    setPageStep,
    doMainActionSteps,
  } = useStepper<VoteCreationSteps>(creationStepFuncs, VoteCreationSteps.METADATA)

  const value = {
    pageStep,
    metadata, parameters, methods: {
      setTitle,
      setDescription,
      setMode
    }
  }

  return (
    <UseVoteCreationContext.Provider value={value}>
      {children}
    </UseVoteCreationContext.Provider>
  )
}
