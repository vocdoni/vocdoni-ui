import { useEffect, useState } from 'react'
import { useBlockHeight, usePool, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import {
  ProcessDetails,
  CensusOffChain,
  CensusOffChainApi,
  normalizeText,
  bufferToBigInt,
  CensusOnChainApi,
  Poseidon,
  Symmetric,
  VochainProcessStatus
} from 'dvote-js'
import { PREREGISTER_PATH, VOTING_PATH } from '../const/routes'
import i18n from '../i18n'
import { digestedWalletFromString, importedRowToString, calculateAnonymousKey } from '../lib/util'
import { useMessageAlert } from './message-alert'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from './use-wallet'
import { utils } from 'ethers'
import { CensusPoof, Voter, ZKCensusPoof } from '@lib/types'
import { useSetRecoilState } from 'recoil'
import { censusProofState } from '@recoil/atoms/census-proof'
import { ZKcensusProofState } from '@recoil/atoms/zk-census-proof'
import { Wallet } from '@ethersproject/wallet'
import { useVoting } from '@hooks/use-voting'
import { walletState } from '@recoil/atoms/wallet'
import { useDbVoters } from './use-db-voters'
import { InvalidIncognitoModeError } from '@lib/validators/errors/invalid-incognito-mode-error'

// CONTEXT

type IAuthForm = {
  emptyFields?: boolean,
  invalidProcessId?: boolean,
  loadingInfo?: boolean,
  loadingInfoError?: string,
  processInfo?: ProcessDetails,
  fieldNames: string[],
  authFields: string[],
  formValues: { [k: string]: string },
  secretKey: string,
  invalidCredentials: boolean,
  shouldRedirect: boolean

  methods: {
    setFormValue: (key: string, value: string) => void,
    onLogin: () => Promise<void | number>
    setSecretKey,
    calculateAnonymousKey: (privKey: string, password: string, entityId) => bigint
  }
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useAuthForm = () => {
  const router = useRouter()
  const { poolPromise } = usePool()
  const { setWallet, wallet } = useWallet({ role: WalletRoles.VOTER })
  const setCensusProof = useSetRecoilState<CensusPoof>(censusProofState)
  const setZKCensusProof = useSetRecoilState<ZKCensusPoof>(ZKcensusProofState)
  const processId = useUrlHash().slice(1) // Skip /
  const invalidProcessId = processId && !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo, refresh: refreshProcessInfo } = useProcess(processId)
  const { blockHeight } = useBlockHeight()
  // check if process started
  // if the process is archived => current time greater thant process start date
  // else use start block
  const processStarted = processInfo?.state.status >= VochainProcessStatus.READY && blockHeight >= processInfo?.state?.startBlock
  const userRequirePreregister = processInfo?.state?.processMode?.preRegister && !processStarted
  const anonymousProcess = processInfo?.state?.envelopeType?.anonymous || false
  const { setAlertMessage } = useMessageAlert()
  const [formValues, setFormValues] = useState<{ [k: string]: string }>({})
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [authFields, setAuthFields] = useState<string[]>([])
  const [secretKey, setSecretKey] = useState<string>()
  const { methods: votingMethods } = useVoting(processId)
  const { addVoter, updateVoter, getVoter } = useDbVoters()
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false)

  const fieldNames: string[] = processInfo?.metadata?.meta?.formFieldTitles || []

  useEffect(() => {
    refreshProcessInfo(processId)
  }, [processStarted])

  const setFormValue = (key: string, value: string) => {
    if (!fieldNames.includes(key)) return

    const newValue = Object.assign({}, formValues)
    newValue[key] = value
    setFormValues(newValue)
  }

  const onLogin = (): Promise<void | number> => {
    let authFieldsData: string[] = []
    // validate all fields are not empty
    for (const fieldName of fieldNames) {
      if (!formValues[fieldName]) {
        setAlertMessage(i18n.t("errors.please_fill_in_all_the_fields"))
        return Promise.resolve()
      }

      authFieldsData.push(formValues[fieldName])
    }

    const entityId = utils.getAddress(processInfo.state?.entityId)
    setAuthFields(authFieldsData)

    const voterWallet = walletFromAuthData(authFieldsData, entityId)
    let voter = getVoter(voterWallet.address, processInfo.id)

    // if voting is anonymous
    if (anonymousProcess) {
      if (!processStarted) {
        // Anonymous and process has not started and there is no info of preregistration
        // Follow the standardflow to reach the preregister page
        return standardAuthFormHandler(voterWallet, authFieldsData, voter)
      }
      // Anonymous and Process has started and there is no info of preregistration
      // The user should provide the process key from the form
      // if is anonymous and the key field is empty return
      if ((!secretKey || secretKey.length == 0) && (!voter || (voter && !voter.encrAnonKey))) {
        setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
        return Promise.resolve()
      }

      // recvoer secretKey
      if (!secretKey || secretKey.length == 0) {
        // voter has preregistered and a user entry of this exists in the IndexedDB
        setSecretKey(Symmetric.decryptString(voter.encrAnonKey, voterWallet.privateKey))
      }
      const anonymousKey = calculateAnonymousKey(voterWallet.privateKey, secretKey, processInfo?.state?.entityId)
      return poolPromise.then(pool =>
        CensusOnChainApi.generateProof(processInfo?.state?.rollingCensusRoot, anonymousKey, pool)
      ).then(async anonymousProof => {
        if (!anonymousProof) throw new Error("Invalid census proof")
        setZKCensusProof(anonymousProof)
        // Set the voter wallet recovered
        votingMethods.setAnonymousKey(anonymousKey)
        setWallet(voterWallet)
        const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.privateKey)
        // store auth data in local storage for disconnect banner
        localStorage.setItem('voterData', encryptedAuthfield)
        try {
          if (!voter) {
            await addVoter({
              address: voterWallet.address,
              processId: processId,
              loginData: encryptedAuthfield,
              encrAnonKey: secretKey,
            })
          } else if (voter && !voter.encrAnonKey) {
            await updateVoter({
              address: voterWallet.address,
              processId: processId,
              loginData: encryptedAuthfield,
              encrAnonKey: secretKey,
            })
          }
        } catch (error) {
          if (error?.message?.indexOf?.("mutation") >= 0) { // if is incognito mode throw these error
            throw new InvalidIncognitoModeError()
          }
          throw new Error(error)
        }


        if (userRequirePreregister) {
          router.push(PREREGISTER_PATH + "#/" + processInfo?.id)
        } else {
          router.push(VOTING_PATH + "#/" + processInfo?.id)
        }
      }).catch(err => {
        setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
      })
    } else {
      return standardAuthFormHandler(voterWallet, authFieldsData, voter)
    }
  }

  const standardAuthFormHandler = (voterWallet: Wallet, authFieldsData: string[], voter: Voter) => {
    // calculate plain census claim, perform generateProof and redirect
    // according to anonymous o plain census
    const digestedHexClaim = CensusOffChain.Public.encodePublicKey(voterWallet.publicKey)

    return poolPromise.then(pool =>
      CensusOffChainApi.generateProof(processInfo.state?.censusRoot, { key: digestedHexClaim }, pool)
    ).then(async censusProof => {
      if (!censusProof) throw new Error("Invalid census proof")
      if (userRequirePreregister && !processStarted && voter && voter.encrAnonKey) {
        setShouldRedirect(true)
        return
      }
      setCensusProof(censusProof)
      // Set the voter wallet recovered
      setWallet(voterWallet)
      const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.privateKey)
      // store auth data in local storage for disconnect banner
      localStorage.setItem('voterData', encryptedAuthfield)
      if (!voter) {
        try {
          await addVoter({
            address: voterWallet.address,
            processId: processInfo.id,
            loginData: encryptedAuthfield,
          })
        } catch (error) {
          if (error?.message?.indexOf?.("mutation") >= 0) { // if is incognito mode throw these error
            throw new InvalidIncognitoModeError()
          }
          throw new Error(error)
        }
      }


      if (userRequirePreregister) {
        router.push(PREREGISTER_PATH + "#/" + processInfo?.id)
      } else {
        router.push(VOTING_PATH + "#/" + processInfo?.id)
      }
    }).catch(err => {
      setInvalidCredentials(true)
      setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
    })
  }

  const walletFromAuthData = (authFieldsData: string[], entityId: string): Wallet => {
    authFieldsData = authFieldsData.map(x => normalizeText(x))
    const strPayload = importedRowToString(authFieldsData, entityId)
    return digestedWalletFromString(strPayload)
  }

  const emptyFields = !formValues || Object.values(formValues).some(v => !v)

  const value: IAuthForm = {
    invalidCredentials,
    loadingInfo,
    loadingInfoError,
    processInfo,
    emptyFields,
    invalidProcessId,
    fieldNames,
    formValues,
    authFields,
    secretKey,
    shouldRedirect,

    methods: {

      setFormValue,
      onLogin,
      setSecretKey,
      calculateAnonymousKey
    }
  }
  return value
}
