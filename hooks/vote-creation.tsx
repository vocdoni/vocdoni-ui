/* eslint-disable react/react-in-jsx-scope */
import { usePool } from '@vocdoni/react-hooks'
import {
  CensusOffChainApi,
  ProcessContractParameters,
  ProcessEnvelopeType,
  ProcessMetadata,
  ProcessMetadataTemplate,
  checkValidProcessMetadata,
  ProcessMode,
  VotingApi,
  INewProcessParams,
  ProcessCensusOrigin,
  GatewayPool,
  FileApi
} from 'dvote-js'
import { createContext, useContext, useState } from 'react'
import { VoteCreationPageSteps } from '../components/steps-new-vote'
import { useForceUpdate } from "./use-force-update"
import i18n from '../i18n'
import { uploadFileToIpfs } from '../lib/file'
import { StepperFunc, StepperFuncResult } from '../lib/types'
import { extractDigestedPubKeyFromString, importedRowToString } from '../lib/util'
import { useStepper } from './use-stepper'
import { useWallet } from './use-wallet'

export interface VoteCreationContext {
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  pageStep: VoteCreationPageSteps,

  processId: string,
  created: boolean,
  pleaseWait: boolean,
  creationError: string,
  methods: {
    // TODO: ADD METHODS EXPORTED BELOW
  },
}

export const UseVoteCreationContext = createContext<VoteCreationContext>({} as any)

// Frontend
export const useVoteCreation = () => {
  const voteCtx = useContext(UseVoteCreationContext)
  if (voteCtx === null) {
    throw new Error('useAccount() can only be used on the descendants of <UseVoteCreationProvider />,')
  }

  return voteCtx
}

// Backend
export const UseVoteCreationProvider = ({ children }) => {
  const [processId, setProcessId] = useState("")
  const { metadata, methods: metadataMethods } = useProcessMetadata()
  const { parameters, methods: paramsMethods } = useProcessParameters()
  const [spreadsheetData, setSpreadsheetData] = useState<string[][]>()
  const [headerFile, setHeaderFile] = useState<File>()
  const [headerURL, setHeaderURL] = useState<string>('')
  const { wallet } = useWallet()
  const { pool, poolPromise } = usePool()

  // STEPPER OPERATIONS

  const stepEnsureMedia: StepperFunc = () => {
    // TODO: how to check if a new header file or url is added?
    if (metadata.media.header.length) return Promise.resolve({ waitNext: false }) // next step
    if (!headerURL.length || !headerFile) return Promise.reject({ error: i18n.t('errors.missing_media_info') })

    // TODO: We may need to add an extra state to hold the `File` value
    return poolPromise
      .then(pool => {
        if (headerFile) return uploadFileToIpfs(headerFile, pool, wallet)
        return headerURL
      })
      .then(header => {
        metadataMethods.setMedia({ header })
        return Promise.resolve({ waitNext: false })
      })
      .catch(err => {
        console.error(err)
        return Promise.reject({ error: i18n.t('errors.cannot_upload_file') })
      })
  }

  const stepEnsureMetadataUploaded: StepperFunc = () => {
    if (parameters.metadata.length) return Promise.resolve({ waitNext: true })

    if (!metadata.title.default.length)
      return Promise.reject({ error: i18n.t('errors.missing_title') })


    if (!metadata.description.default.length)
      return Promise.reject({ error: i18n.t('errors.missing_description') })

    try {
      const meta = checkValidProcessMetadata(metadata)
      metadataMethods.setRawMetadata(meta)
    } catch (error) {
      return Promise.reject({ error: i18n.t('errors.process.invalid_metadata') })
    }


    // TODO: Get the JSON metadata, update it to IPFS
    // TODO: check it does not overlap with
    const strJsonMeta = JSON.stringify(metadata)

    return poolPromise
      .then(pool => FileApi.add(strJsonMeta, `process-metadata.json`, wallet, pool))
      .then(metadataURL => {
        paramsMethods.setMetadata(metadataURL)
        return Promise.resolve({ waitNext: false })
      })
      .catch(err => {
        console.error(err)
        return Promise.reject({ error: i18n.t('errors.cannot_upload_file') })
      })
  }

  const stepEnsureCensusCreated: StepperFunc = async () => {
    if (parameters.censusRoot && parameters.censusUri) return { waitNext: false } // next step

    const name = metadata.title.default + '_' + Math.floor(Date.now() / 1000)

    // Process the CSV entries
    const claims = await Promise.all(spreadsheetData.map((row) => new Promise((resolve) => {
      setTimeout(() =>
        resolve({
          key: extractDigestedPubKeyFromString(importedRowToString(row, wallet.address)).digestedHexClaim,
        })
        , 50)
    }))) as { key: string, value?: string }[]

    // Create the census
    const { censusId } = await CensusOffChainApi.addCensus(name, [wallet._signingKey().publicKey], wallet, pool)
    const { censusRoot, invalidClaims } = await CensusOffChainApi.addClaimBulk(censusId, claims, true, wallet, pool)
    if (invalidClaims.length) {
      return { error: i18n.t('error.invalid_claims_found', { total: invalidClaims.length }) }
    }
    const censusUri = await CensusOffChainApi.publishCensus(censusId, wallet, pool)

    // Update the state
    paramsMethods.setCensusOrigin(new ProcessCensusOrigin(ProcessCensusOrigin.OFF_CHAIN_TREE))
    paramsMethods.setCensusRoot(censusRoot)
    paramsMethods.setCensusUri(censusUri)

    return { waitNext: true }
  }

  const stepEnsureValidParams: StepperFunc = () => {

    // TODO: Do a synchronous check that the process params make sense and contain no incompatible values
    if (isNaN(parameters.startBlock) || isNaN(parameters.blockCount))
      return Promise.reject({ error: i18n.t('errors.process.invalid_starting_date') })

    if (parameters.blockCount <= 0)
      return Promise.reject({ error: i18n.t('errors.process.invalid_dates') })

    return Promise.resolve({ waitNext: false })
  }

  const stepEnsureProcessCreated: StepperFunc = (): Promise<StepperFuncResult> => {
    let pool: GatewayPool

    return poolPromise
      .then(async (p) => {
        pool = p

        // ProcessContractParameters !== INewProcessParams
        // parameters.metadata = metadata
        // Set proper maxValue and maxCount
        let maxValue = 0, maxCount = 0
        metadata.questions.forEach((question) => {
          if (maxValue < question.choices.length) {
            maxValue = question.choices.length
          }
          maxCount++
        })

        // Since the ref does not change, we should not have to wait for propagation here
        paramsMethods.setMaxValue(maxValue)
        paramsMethods.setMaxCount(maxCount)

        // Creation
        const finalParams: INewProcessParams = {
          startBlock: parameters.startBlock,
          blockCount: parameters.blockCount,
          censusOrigin: parameters.censusOrigin,
          censusRoot: parameters.censusRoot,
          costExponent: parameters.costExponent,
          envelopeType: parameters.envelopeType,
          maxCount: parameters.maxCount,
          maxTotalCost: parameters.maxTotalCost,
          maxValue: parameters.maxValue,
          maxVoteOverwrites: parameters.maxVoteOverwrites,
          mode: parameters.mode,
          metadata,
          censusUri: parameters.censusUri,
          paramsSignature: "0x0000000000000000000000000000000000000000000000000000000000000000",
        }
        return VotingApi.newProcess(finalParams, wallet, pool)
      }).then(processId => {
        console.debug("processId:", processId)

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
    stepEnsureMedia,
    stepEnsureMetadataUploaded,
    stepEnsureCensusCreated,
    stepEnsureValidParams,
    stepEnsureProcessCreated,
  ]

  const {
    pageStep,
    actionStep,
    pleaseWait,
    creationError,
    setPageStep,
    doMainActionSteps,
  } = useStepper<VoteCreationPageSteps>(creationStepFuncs, VoteCreationPageSteps.METADATA)

  const value = {
    processId,
    pageStep,
    created: actionStep >= creationStepFuncs.length,
    pleaseWait,
    creationError,
    metadata,
    parameters,
    methods: {
      ...metadataMethods,
      ...paramsMethods,
      setHeaderFile,
      setHeaderURL,
      setPageStep,
      createProcess: doMainActionSteps,
      continueCreation: doMainActionSteps,
    }
  }

  return (
    <UseVoteCreationContext.Provider value={value}>
      {children}
    </UseVoteCreationContext.Provider>
  )
}

// HELPERS

const useProcessMetadata = () => {
  const [metadata, setRawMetadata] = useState<ProcessMetadata>(() => JSON.parse(JSON.stringify(ProcessMetadataTemplate)))

  const setTitle = (title: string) => {
    setRawMetadata({ ...metadata, title: { default: title } })
  }
  const setDescription = (description: string) => {
    setRawMetadata({ ...metadata, description: { default: description } })
  }
  const setMedia = (media: ProcessMetadata["media"]) => {
    setRawMetadata({ ...metadata, media: { ...metadata.media, ...media } })
  }
  const setMetaFields = (values: ({ [k: string]: any })) => {
    setRawMetadata({ ...metadata, meta: { ...metadata.meta, ...values } })
  }
  const setQuestions = (questions: ProcessMetadata["questions"]) => {
    setRawMetadata({ ...metadata, questions })
  }

  const methods = {
    setTitle,
    setDescription,
    setMedia,
    setMetaFields,
    setQuestions,
    setRawMetadata
  }
  return { metadata, methods }
}

const useProcessParameters = () => {
  const [parameters, setParameters] = useState<ProcessContractParameters>(() => new ProcessContractParameters())
  // manually trigger updates without the need of creating instance clones
  const forceUpdate = useForceUpdate()

  const setMode = (mode: ProcessMode) => {
    if (parameters.mode === mode) return

    parameters.mode = mode
    forceUpdate()
  }
  const setEnvelopeType = (envelopeType: ProcessEnvelopeType) => {
    if (parameters.envelopeType === envelopeType) return

    parameters.envelopeType = envelopeType
    forceUpdate()
  }
  const setStartBlock = (startBlock: number) => {
    if (startBlock < 0) throw new Error("Invalid blockCount")

    parameters.startBlock = startBlock
    forceUpdate()
  }
  const setBlockCount = (blockCount: number) => {
    if (blockCount < 0) throw new Error("Invalid blockCount")

    parameters.blockCount = blockCount
    forceUpdate()
  }
  const setCensusOrigin = (censusOrigin: ProcessCensusOrigin) => {
    if (parameters.censusOrigin === censusOrigin) return

    parameters.censusOrigin = censusOrigin
    forceUpdate()
  }
  const setCensusRoot = (censusRoot: string) => {
    if (!censusRoot) throw new Error("Invalid censusRoot")
    if (parameters.censusRoot === censusRoot) return


    parameters.censusRoot = censusRoot
    forceUpdate()
  }
  const setCensusUri = (censusUri: string) => {
    if (!censusUri) throw new Error("Invalid censusUri")
    if (parameters.censusUri === censusUri) return


    parameters.censusUri = censusUri
    forceUpdate()
  }
  const setCostExponent = (costExponent: number) => {
    if (costExponent < 0 || costExponent >= 65535) throw new Error("Invalid cost exponent")
    if (parameters.costExponent === costExponent) return


    parameters.costExponent = costExponent
    forceUpdate()
  }
  // const setEntityAddress = (entityAddress: string) => {
  //   if (!entityAddress) throw new Error("Invalid entity address")

  //   parameters.entityAddress = entityAddress
  //   forceUpdate()
  // }

  // parameters.evmBlockHeight

  const setMaxCount = (maxCount: number) => {
    if (maxCount < 0) throw new Error("Invalid maxCount")
    if (parameters.maxCount === maxCount) return


    parameters.maxCount = maxCount
    forceUpdate()
  }
  const setMaxTotalCost = (maxTotalCost: number) => {
    if (maxTotalCost < 0) throw new Error("Invalid maxTotalCost")
    if (parameters.maxTotalCost === maxTotalCost) return


    parameters.maxTotalCost = maxTotalCost
    forceUpdate()
  }
  const setMaxValue = (maxValue: number) => {
    if (maxValue < 0) throw new Error("Invalid maxValue")
    if (parameters.maxValue === maxValue) return


    parameters.maxValue = maxValue
    forceUpdate()
  }
  const setMaxVoteOverwrites = (maxVoteOverwrites: number) => {
    if (maxVoteOverwrites < 0) throw new Error("Invalid maxVoteOverwrites")
    if (parameters.maxVoteOverwrites === maxVoteOverwrites) return


    parameters.maxVoteOverwrites = maxVoteOverwrites
    forceUpdate()
  }
  const setMetadata = (metadata: string) => {
    if (!metadata) throw new Error("Invalid metadata")

    parameters.metadata = metadata
    forceUpdate()
  }

  // parameters.paramsSignature
  // parameters.questionCount  (computed automatically by dvote-js)

  // parameters.questionIndex
  // parameters.status

  const methods = {
    setMode,
    setEnvelopeType,
    setStartBlock,
    setBlockCount,
    setCensusOrigin,
    setCensusRoot,
    setCensusUri,
    setCostExponent,
    // setEntityAddress,
    setMaxCount,
    setMaxTotalCost,
    setMaxValue,
    setMaxVoteOverwrites,
    setMetadata,
  }
  return { parameters, methods }
}
