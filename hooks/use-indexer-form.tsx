import { useEffect, useRef, useState } from 'react'
import { useBlockHeight, usePool, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import {
  Symmetric,
} from '@vocdoni/encryption'
import { VOTING_PATH } from '../const/routes'
import i18n from '../i18n'
import { digestedWalletFromString, importedRowToString } from '../lib/util'
import { useMessageAlert } from './message-alert'
import { useWallet, WalletRoles } from './use-wallet'
import { Wallet } from '@ethersproject/wallet'
import { CspIndexer, CspSMSAuthenticator } from "@vocdoni/csp"
import { CSP } from "@vocdoni/client"
import { strip0x } from '@vocdoni/common'

// CONTEXT

type IAuthForm = {
  emptyFields?: boolean,
  invalidProcessId?: boolean,
  fieldNames: string[],
  authFields: string[],
  formValues: { [k: string]: string },
  invalidCredentials: boolean,
  authToken?: string
  processId?: string
  loading?: boolean
  loadingError?: string,
  remainingAttempts: number,
  consumed: boolean,

  // cspAuthenticator

  methods: {
    setFormValue: (key: string, value: string) => void,
    onLogin: () => Promise<void | number>
  }
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useIndexerForm = () => {
  const router = useRouter()
  const { poolPromise } = usePool()
  const { setWallet, wallet } = useWallet({ role: WalletRoles.VOTER })
  const [processId, setProcessId] = useState<string>()
  const { setAlertMessage } = useMessageAlert()
  const [formValues, setFormValues] = useState<{ [k: string]: string }>({})
  const [invalidCredentials, setInvalidCredentials] = useState(false)
  const [authFields, setAuthFields] = useState<string[]>([])
  const [loadingError, setLoadingError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [remainingAttempts, setRemainingAttempts] = useState<number>(0)
  const [consumed, setConsumed] = useState<boolean>(false)
  // const cspAuthenticator = useRef<AsyncGenerator<CspSMSAuthenticator.CSPAuthGeneratorStepValue>>(CspSMSAuthenticator.authenticate("", null))

  const fieldNames: string[] = ["clauSoci", "pin"]
  const salt = "b297ed61bb6195919075c18677a56fd1cd7b54c4b5e64efb573e8e030fc05163"

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

    setAuthFields(authFieldsData)
    const voterWallet = walletFromAuthData(authFieldsData, salt)
    setWallet(voterWallet)
    setLoading(true)

    // if voting is anonymous
    // if (requireSecretKey) {
    //   // if is anonymous and the key field is empty return
    //   if (secretKey.length == 0) {
    //     setAlertMessage(i18n.t("errors.please_fill_in_all_the_fields"))
    //     return Promise.resolve()
    //   }

    //   const anonymousKey = calculateAnonymousKey(voterWallet.privateKey, secretKey, processInfo?.state?.entityId)
    //   return poolPromise.then(pool =>
    //     CensusOnChainApi.generateProof(processInfo?.state?.rollingCensusRoot, anonymousKey, pool)
    //   ).then(anonymousProof => {
    //     if (!anonymousProof) throw new Error("Invalid census proof")
    //     setZKCensusProof(anonymousProof)
    //     // Set the voter wallet recovered
    //     votingMethods.setAnonymousKey(anonymousKey)
    //     setWallet(voterWallet)

    //     if (userRequirePreregister) {
    //       router.push(PREREGISTER_PATH + "#/" + processInfo?.id)
    //     } else {
    //       router.push(VOTING_PATH + "#/" + processInfo?.id)
    //     }
    //   }).catch(err => {
    //     setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
    //   })
    // } else if (requireCSP) {







    let csp = new CSP(process.env.CSP_URL, process.env.CSP_PUB_KEY, process.env.CSP_API_VERSION)


    let electionId: string
    CspIndexer.getUserProcesses(strip0x(voterWallet.privateKey), csp)
      .then(processes => {
        if (processes.length != 1) return Promise.reject(new Error("No process found for user"))
        electionId = processes[0]["electionId"]
        console.log(electionId)
        console.log("remainingAttempts:" + processes[0]["remainingAttempts"]);
        setRemainingAttempts(Number(processes[0]["remainingAttempts"]))

        console.log("consumed:" + String(processes[0]["consumed"]));
        setConsumed(Boolean(processes[0]["consumed"]))
        setProcessId(electionId)

        setLoading(false)
        const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.publicKey)
        // store auth data in local storage for disconnect banner
        localStorage.setItem('voterData', encryptedAuthfield)
        router.push(VOTING_PATH + "#/" + "0x" + electionId)
      })
      .catch(err => {
        setInvalidCredentials(true)
        setLoadingError(err)
        setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
        throw new Error(err)
      })


    // WITH AUTHENTICATOR
    // let authenticator = CspSMSAuthenticator.authenticate(voterWallet.privateKey, csp, voterWallet)
    // let procId
    // cspAuthenticator.current = authenticator
    // authenticator.next()
    //   .then(result => {
    //     let info = result.value
    //     console.log(info)
    //     if (!(info["key"] === CspSMSAuthenticator.CspSmsAuthenticatorSteps.GET_PROCESS && "electionId" in info)) {
    //       throw new Error("Error getting process")
    //     }
    //     procId = info["electionId"]
    //     console.log(procId)
    //     setProcessId(info["electionId"])

    //     setLoading(false)
    //     const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.publicKey)
    //     // store auth data in local storage for disconnect banner
    //     localStorage.setItem('voterData', encryptedAuthfield)
    //     router.push(VOTING_PATH + "#/" + "0x" + procId)
    //   })
    //   .catch(err => {
    //     setInvalidCredentials(true)
    //     setLoadingError(err)
    //     setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
    //     throw new Error(err)
    //   })



    // let indexerRequest = await authenticator.next()
    // if (indexerRequest["key"] == CspSMSAuthenticator.CspSmsAuthenticatorSteps.GET_PROCESS && "processId" in indexerRequest) {
    //   console.log(indexerRequest["processId"])
    //   setProcessId(indexerRequest["processId"])
    // } else {
    //   throw new Error()
    // }
    // let authTokenRequest = authenticator.next()
    // if (authTokenRequest["key"] == CspSMSAuthenticator.CspSmsAuthenticatorSteps.GET_AUTH_TOKEN && "authToken" in authTokenRequest) {
    //   console.log(authTokenRequest["authToken"])
    //   setAuthToken(authTokenRequest["authToken"])
    // } else {
    //   throw new Error()
    // }
    // setLoading(false)
    // const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.publicKey)
    // // store auth data in local storage for disconnect banner
    // localStorage.setItem('voterData', encryptedAuthfield)
    // router.push(VOTING_PATH + "#/" + "0x" + indexerRequest["processId"])

    // } else {
    //   // calculate plain census claim, perform generateProof and redirect
    //   // according to anonymous o plain census
    //   const digestedHexClaim = CensusOffChain.Public.encodePublicKey(voterWallet.publicKey)

    //   return poolPromise.then(pool =>
    //     CensusOffChainApi.generateProof(processInfo.state?.censusRoot, { key: digestedHexClaim }, pool)
    //   ).then(censusProof => {
    //     if (!censusProof) throw new Error("Invalid census proof")
    //     setCensusProof(censusProof)
    //     // Set the voter wallet recovered
    //     setWallet(voterWallet)
    //     const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.publicKey)
    //     // store auth data in local storage for disconnect banner
    //     localStorage.setItem('voterData', encryptedAuthfield)

    //     if (userRequirePreregister) {
    //       router.push(PREREGISTER_PATH + "#/" + processInfo?.id)
    //     } else {
    //       router.push(VOTING_PATH + "#/" + processInfo?.id)
    //     }
    //   }).catch(err => {
    //     setInvalidCredentials(true)
    //     setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
    //   })
    // }
  }
  const walletFromAuthData = (authFieldsData: string[], salt: string): Wallet => {
    const strPayload = importedRowToString(authFieldsData, salt)
    return digestedWalletFromString(strPayload)
  }



  const emptyFields = !formValues || Object.values(formValues).some(v => !v)

  const value: IAuthForm = {
    invalidCredentials,
    emptyFields,
    fieldNames,
    formValues,
    authFields,
    processId,
    loading,
    loadingError,
    remainingAttempts,
    consumed,

    methods: {

      setFormValue,
      onLogin,
    }
  }
  return value
}
