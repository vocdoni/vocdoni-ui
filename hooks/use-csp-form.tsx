import { VOTING_PATH } from '@const/routes'
import { digestedWalletFromString, importedRowToString } from '@lib/util'
import { CSP } from '@vocdoni/client'
import { strip0x } from '@vocdoni/common'
import { CspIndexer, CspSMSAuthenticator } from '@vocdoni/csp'
import { Symmetric } from '@vocdoni/encryption'
import { Wallet } from 'ethers'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import i18n from '../i18n'
import { useMessageAlert } from './message-alert'
import { useWallet, WalletRoles } from './use-wallet'

export interface CSPState {
  remainingAttempts: number
  setAttempts: (attempts: number) => void
  consumed: boolean
  setConsumed: (consumed: boolean) => void
  firstSent: boolean
  setFirstSent: (sent: boolean) => void
  cooldown: number
  coolItDown: () => void
}

export const CSPContext = createContext<CSPState>({
  remainingAttempts: 0,
  setAttempts: (attempts) => {},
  consumed: true,
  setConsumed: (consumed) => {},
  firstSent: false,
  setFirstSent: (sent) => {},
  cooldown: 0,
  coolItDown: () => {},
})

export const CSPProvider = ({children} : {children: ReactNode}) => {
  const [attempts, setAttempts] = useState<number>(0)
  const [consumed, setConsumed] = useState<boolean>(true)
  const [firstSent, setFirstSent] = useState<boolean>(false)
  const coolref = useRef<number>(null)
  const [cooldown, setCooldown] = useState<number>(0)
  const [interval, setInterval] = useState<number>(0)

  const coolItDown = () => {
    if (!interval && !coolref.current || coolref.current <= 0) {
      coolref.current = 120
      setCooldown(coolref.current)
      const int = window.setInterval(() => {
        coolref.current -= 1
        setCooldown(coolref.current)
        if (coolref.current <= 0) {
          window.clearInterval(interval)
          setInterval(0)
        }
      }, 1000)
      setInterval(int)
    }
  }

  // clear interval on component unmount
  useEffect(() => {
    return () => {
      if (!interval) return
      window.clearInterval(interval)
    }
  }, [interval])

  const value = {
    remainingAttempts: attempts,
    setAttempts,
    consumed,
    setConsumed,
    firstSent,
    setFirstSent,
    cooldown,
    coolItDown,
  }

  return (
    <CSPContext.Provider value={value}>
      {children}
    </CSPContext.Provider>
  )
}

export const useCSPForm = () => {
  const cspCtxt = useContext(CSPContext)
  const router = useRouter()
  const [ formValues, setFormValues ] = useState<{ [k: string]: string }>({})
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ processId, setProcessId ] = useState<string>()
  const [ loadingError, setLoadingError ] = useState<string>()
  const [ invalidCredentials, setInvalidCredentials ] = useState<boolean>(false)
  const { setAlertMessage } = useMessageAlert()
  const { setWallet, wallet } = useWallet({ role: WalletRoles.VOTER })
  const { setAttempts, setConsumed } = cspCtxt

  const emptyFields = !formValues || Object.values(formValues).some(v => !v)

  const walletFromAuthData = (authFieldsData: string[], salt: string): Wallet => {
    const strPayload = importedRowToString(authFieldsData, salt)
    return digestedWalletFromString(strPayload)
  }

  const fieldNames = ['clauSoci', 'pin']
  const salt = 'b297ed61bb6195919075c18677a56fd1cd7b54c4b5e64efb573e8e030fc05163'

  return {
    ...cspCtxt,
    formValues,
    emptyFields,
    fieldNames,
    loading,
    processId,
    loadingError,
    invalidCredentials,
    onLogin: async () => {
      let authFieldsData: string[] = []
      // validate all fields are not empty
      for (const fieldName of fieldNames) {
        if (!formValues[fieldName]) {
          setAlertMessage(i18n.t("errors.please_fill_in_all_the_fields"))
          return true
        }

        authFieldsData.push(formValues[fieldName])
      }

      // setAuthFields(authFieldsData)
      const voterWallet = walletFromAuthData(authFieldsData, salt)
      setWallet(voterWallet)
      setLoading(true)

      const csp = new CSP(process.env.CSP_URL, process.env.CSP_PUB_KEY, process.env.CSP_API_VERSION)
      let electionId: string

      return await CspIndexer.getUserProcesses(strip0x(voterWallet.privateKey), csp)
        .then(processes => {
          if (processes.length != 1) throw new Error("No process found for user")
          electionId = processes[0]["electionId"]
          setAttempts(Number(processes[0]["remainingAttempts"]))

          setConsumed(Boolean(processes[0]["consumed"]))
          setProcessId(electionId)

          const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.publicKey)
          // store auth data in local storage for disconnect banner
          localStorage.setItem('voterData', encryptedAuthfield)
          router.push(VOTING_PATH + "#/" + "0x" + electionId)
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
          setInvalidCredentials(true)
          setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
          throw err
        })
    },
    setFormValue: (key: string, value: string) => {
      if (!fieldNames.includes(key)) return

      const newValue = Object.assign({}, formValues)
      newValue[key] = value
      setFormValues(newValue)
    },
  }
}
