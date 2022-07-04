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

    const csp = new CSP(process.env.CSP_URL, process.env.CSP_PUB_KEY, process.env.CSP_API_VERSION)
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
