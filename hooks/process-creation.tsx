/* eslint-disable react/react-in-jsx-scope */
import { useBlockAtDate, useBlockStatus, usePool } from '@vocdoni/react-hooks'
import {
  CensusOffChainApi,
  CensusOffchainDigestType,
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
  normalizeText
} from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { ProcessCreationPageSteps } from '../components/steps-new-vote'
import { useForceUpdate } from "./use-force-update"
import i18n from '../i18n'
import { uploadFileToIpfs } from '../lib/file'
import { StepperFunc, StepperFuncResult } from '../lib/types'
import { digestedWalletFromString, importedRowToString } from '../lib/util'
import { useStepper } from './use-stepper'
import { useWallet } from './use-wallet'
import moment from 'moment'
import { isUri } from '../lib/regex'
import { SpreadSheetReader } from '../lib/spread-sheet-reader'
import { utils } from 'ethers'

export interface ProcessCreationContext {
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  pageStep: ProcessCreationPageSteps,
  actionStep: number,
  processId: string,
  created: boolean,
  pleaseWait: boolean,
  creationError: string,
  headerFile: File,
  headerURL: string,
  startRightAway: boolean,
  startDate: Date,
  endDate: Date,
  spreadSheetReader,
  methods: {
    setPageStep: (s: ProcessCreationPageSteps) => void,

    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    // setMedia: (media: ProcessMetadata["media"]) => void;
    setMediaStreamURI: (streamUri: string) => void
    setMetaFields: (values: {
      [k: string]: any;
    }) => void;
    setQuestions: (questions: ProcessMetadata["questions"]) => void;
    setRawMetadata: (metadata: ProcessMetadata) => void,
    //
    setMode: (mode: ProcessMode) => void;
    setEnvelopeType: (envelopeType: ProcessEnvelopeType) => void;
    setStartBlock: (startBlock: number) => void;
    setBlockCount: (blockCount: number) => void;
    setCensusOrigin: (censusOrigin: ProcessCensusOrigin) => void;
    // TODO:
    setCensusRoot: (censusRoot: string) => void,
    setCensusUri: (censusUri: string) => void,
    setCostExponent: (costExponent: number) => void,
    // setEntityAddress,
    setMaxCount: (maxCount: number) => void,
    setMaxTotalCost: (maxTotalCost: number) => void,
    setMaxValue: (maxValue: number) => void,
    setMaxVoteOverwrites: (maxVoteOverwrites: number) => void,
    setStringMetadata: (metadataOrigin: string) => void,
    setSpreadSheetReader: (metadata: SpreadSheetReader) => void,
    setHeaderFile,
    setHeaderURL,
    setStartRightAway,
    setStartDate: (date: Date) => void,
    setEndDate: (date: Date) => void,
    createProcess(): void,
    continueProcessCreation(): void,
  },
}

export const UseProcessCreationContext = createContext<ProcessCreationContext>({} as any)

// Frontend
export const useProcessCreation = () => {
  const voteCtx = useContext(UseProcessCreationContext)
  if (voteCtx === null) {
    throw new Error('useAccount() can only be used on the descendants of <UseProcessCreationProvider />,')
  }

  return voteCtx
}

// Backend
export const UseProcessCreationProvider = ({ children }: { children: ReactNode }) => {
  const [processId, setProcessId] = useState("")
  const { metadata, methods: metadataMethods } = useProcessMetadata()
  const { parameters, methods: paramsMethods } = useProcessParameters()
  const [spreadSheetReader, setSpreadSheetReader] = useState<SpreadSheetReader>()
  const [headerFile, setHeaderFile] = useState<File>()
  const [headerURL, setHeaderURL] = useState<string>('')
  const [startRightAway, setStartRightAway] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const { wallet } = useWallet()
  const { blockStatus } = useBlockStatus()
  const { pool, poolPromise } = usePool()

  // STEPPER OPERATIONS

  const stepEnsureMedia: StepperFunc = () => {
    // Check if the metadata value is already updated
    if (headerURL == metadata.media.header || !(headerFile || headerURL.length)) return Promise.resolve({ waitNext: false }) // next step

    return poolPromise
      .then(pool => {
        if (headerFile) return uploadFileToIpfs(headerFile, pool, wallet)
        else if (!headerURL || !isUri(headerURL)) throw new Error(i18n.t("errors.the_header_image_link_is_not_valid"))
        return headerURL
      })
      .then(header => {
        metadataMethods.setMediaHeader(header)
        return Promise.resolve({ waitNext: true })
      })
      .catch(err => {
        console.error(err)
        return Promise.reject(new Error(i18n.t('errors.cannot_set_media_header')))
      })
  }

  const stepEnsureCensusCreated: StepperFunc = async () => {
    // TODO: Is it possible that the user re-uploads the spreadsheet? How this could be checked?
    if ((parameters.censusRoot && parameters.censusRoot != defaultCensusRoot) &&
      (parameters.censusUri && parameters.censusUri != defaultCensusUri))
      return { waitNext: false } // next step

    const name = metadata.title.default + '_' + Math.floor(Date.now() / 1000)
    const entityId = utils.getAddress(wallet.address)
    const spreadsheetData = spreadSheetReader.data
    metadataMethods.setMetaFields({ 'formFieldTitles': spreadSheetReader.header })

    // TODO: USE Bluebird to limit the concurrency and leave the UI thread some space

    // Process the CSV entries
    const claims = await Promise.all(spreadsheetData.map((row: string[]) => new Promise((resolve) => {
      setTimeout(() => {
        row = row.map(x => normalizeText(x))
        const payload = importedRowToString(row, entityId)
        const voterWallet = digestedWalletFromString(payload)
        const key = CensusOffChainApi.digestPublicKey(voterWallet.publicKey, CensusOffchainDigestType.RAW_PUBKEY)
        resolve({ key })
      }, 50)
    }))) as { key: string, value?: string }[]

    // Create the census
    const { censusId } = await CensusOffChainApi.addCensus(name, [wallet.publicKey], wallet, pool)
    const { censusRoot, invalidClaims } = await CensusOffChainApi.addClaimBulk(censusId, claims, false, wallet, pool)
    if (invalidClaims.length) {
      return Promise.reject(new Error(i18n.t('error.num_entries_could_not_be_added_to_the_census', { total: invalidClaims.length })))
    }
    const censusUri = await CensusOffChainApi.publishCensus(censusId, wallet, pool)

    // Update the state
    // paramsMethods.setCensusOrigin(new ProcessCensusOrigin(ProcessCensusOrigin.OFF_CHAIN_TREE))
    paramsMethods.setCensusRoot(censusRoot)
    paramsMethods.setCensusUri(censusUri)

    return Promise.resolve({ waitNext: true })
  }

  const stepEnsureValidParams: StepperFunc = () => {

    // TODO: Do a synchronous check that the process params make sense and contain no incompatible values

    if (isNaN(parameters.startBlock) || isNaN(parameters.blockCount))
      return Promise.reject(new Error(i18n.t('errors.process.invalid_start_date')))

    if (parameters.blockCount <= 0)
      return Promise.reject(new Error(i18n.t('errors.process.the_vote_cannot_end_before_the_start')))

    if (!startRightAway) {
      const localStartDate = VotingApi.estimateDateAtBlockSync(parameters.startBlock, blockStatus)

      if (Math.abs(moment(localStartDate).diff(moment.now(), 'minute')) < 7) {
        return Promise.reject(new Error(i18n.t('errors.process.invalid_start_date')))
      }
    }

    return Promise.resolve({ waitNext: true })
  }

  const stepEnsureProcessCreated: StepperFunc = (): Promise<StepperFuncResult> => {
    let pool: GatewayPool

    return poolPromise
      .then((p) => {
        pool = p

        // startBlock => now + 7 min
        const startBlock = startRightAway ?
          VotingApi.estimateBlockAtDateTimeSync(new Date(Date.now() + 1000 * 60 * 7), blockStatus)
          : parameters.startBlock

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
          startBlock,
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
        setProcessId(processId)
        // console.log("process created with id: ", processId)
        return {
          waitNext: true,
        }
      })
      .catch((error) => {
        console.error(error)
        return Promise.reject(new Error(i18n.t('error.the_process_could_not_be_registered')))
      })
  }

  const stepEnsureProcessPublished: StepperFunc = (): Promise<StepperFuncResult> => {

    return poolPromise
      .then(async pool => {
        let retries = 25
        const trimProcId = processId.replace(/^0x/, "")
        while (retries >= 0) {
          try {
            // the following getProcessInfo throws if no process is found with this id
            let processInfo = await VotingApi.getProcessInfo(trimProcId, pool)
            if (typeof processInfo !== 'object') {
              throw new Error("invalid process info")
            }
            setPageStep(pageStep + 1)
            return {
              waitNext: true,
            }
          } catch(err) {
            await new Promise(r => setTimeout(r, 6100))// Wait 6s
            retries--
          }
        }

        // Nothing after timeout
        return Promise.reject(new Error(i18n.t('error.the_vote_is_not_available_yet')))
      })
      .catch((error) => {
        console.error(error)
        return Promise.reject(new Error(i18n.t('error.the_process_could_not_be_registered')))
      })
  }

  // Callbacks

  const updateDateRange = () => {
    const startBlock = VotingApi.estimateBlockAtDateTimeSync(startDate, blockStatus)
    const endBlock = VotingApi.estimateBlockAtDateTimeSync(endDate, blockStatus)
    const blockCount = endBlock - startBlock

    paramsMethods.setStartBlock(startBlock)

    if (blockCount < 0) {
      console.error("Negative block count", blockCount, blockStatus.blockNumber)
      return
    }
    paramsMethods.setBlockCount(blockCount)
  }

  useEffect(() => {
    updateDateRange()
  }, [startDate, endDate, blockStatus?.blockNumber])

  const creationStepFuncs = [
    stepEnsureMedia,
    stepEnsureCensusCreated,
    stepEnsureValidParams,
    stepEnsureProcessCreated,
    stepEnsureProcessPublished,
  ]

  const {
    pageStep,
    actionStep,
    pleaseWait,
    creationError,
    setPageStep,
    resetActionStep,
    doMainActionSteps,
  } = useStepper<ProcessCreationPageSteps>(creationStepFuncs, ProcessCreationPageSteps.METADATA)

  const createProcess = () => {
    resetActionStep() // Ensure that the index is zero (for retry)
    setTimeout(() => doMainActionSteps(), 50)
  }

  const value: ProcessCreationContext = {
    processId,
    pageStep,
    created: actionStep >= creationStepFuncs.length,
    actionStep: actionStep,
    pleaseWait,
    creationError: typeof creationError == "string" ? creationError : creationError?.message,
    headerFile,
    headerURL,
    startRightAway,
    startDate,
    endDate,
    metadata,
    parameters,
    spreadSheetReader,
    methods: {
      ...metadataMethods,
      ...paramsMethods,
      setSpreadSheetReader,
      setHeaderFile,
      setHeaderURL,
      setStartRightAway,
      setStartDate,
      setEndDate,
      setPageStep,
      createProcess,
      continueProcessCreation: doMainActionSteps,
    }
  }

  return (
    <UseProcessCreationContext.Provider value={value}>
      {children}
    </UseProcessCreationContext.Provider>
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
  // const setMedia = (media: ProcessMetadata["media"]) => {
  //   setRawMetadata({ ...metadata, media: { ...metadata.media, ...media } })
  // }
  const setMediaHeader = (header: string) => {
    setRawMetadata({ ...metadata, media: { ...metadata.media, header } })
  }
  const setMediaStreamURI = (streamUri: string) => {
    setRawMetadata({ ...metadata, media: { ...metadata.media, streamUri } })
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
    // setMedia,
    setMediaHeader,
    setMediaStreamURI,
    setMetaFields,
    setQuestions,
    setRawMetadata
  }
  return { metadata, methods }
}

const defaultCensusRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"
const defaultCensusUri = "ipfs://"

const useProcessParameters = () => {
  const [parameters] = useState<ProcessContractParameters>(() => ProcessContractParameters.fromParams({
    startBlock: 0,
    blockCount: 10000,
    censusOrigin: ProcessCensusOrigin.OFF_CHAIN_TREE,
    censusRoot: defaultCensusRoot,
    costExponent: 1,
    envelopeType: ProcessEnvelopeType.make({ serial: false, uniqueValues: false, encryptedVotes: false, anonymousVoters: false }),
    maxCount: 1,
    maxTotalCost: 0,
    maxValue: 1,
    maxVoteOverwrites: 0,
    mode: ProcessMode.make({ autoStart: true, interruptible: true, dynamicCensus: false, encryptedMetadata: false }),
    metadata: JSON.parse(JSON.stringify(ProcessMetadataTemplate)),
    censusUri: defaultCensusUri,
    paramsSignature: "0x0000000000000000000000000000000000000000000000000000000000000000",
    questionCount: 1,
  }))
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
    if (!startBlock) return
    else if (startBlock < 0) throw new Error("Invalid startBlock")

    parameters.startBlock = startBlock
    forceUpdate()
  }
  const setBlockCount = (blockCount: number) => {
    if (!blockCount) return
    else if (blockCount < 0) throw new Error("Invalid blockCount")

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
  const setStringMetadata = (metadataOrigin: string) => {
    if (!metadataOrigin) throw new Error("Invalid metadataOrigin")

    parameters.metadata = metadataOrigin
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
    setStringMetadata,
  }
  return { parameters, methods }
}

