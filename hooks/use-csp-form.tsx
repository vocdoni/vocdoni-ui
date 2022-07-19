import { VOTING_PATH } from '@const/routes'
import { digestedWalletFromString, importedRowToString, digestedPrivateKeyFromString } from '@lib/util'
import { CSP } from '@vocdoni/client'
import { strip0x } from '@vocdoni/common'
import { CspIndexer, CspSMSAuthenticator } from '@vocdoni/csp'
import { Symmetric } from '@vocdoni/encryption'
import { Wallet } from 'ethers'
import { useRouter } from 'next/router'
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import i18n from '../i18n'
import { useAdobeAnalytics } from './adobe-analytics'
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
  userId: string
  setUserId: (uid: string) => void
  suffix: string,
  setSuffix: (suffix: string) => void
  setCooldown: (cooldown: number) => void
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
  userId: null,
  setUserId: (uid) => {},
  suffix: '**',
  setSuffix: (suffix) => {},
  setCooldown: (cooldown) => {},
})

export const CSPProvider = ({ children }: { children: ReactNode }) => {
  const [attempts, setAttempts] = useState<number>(0)
  const [consumed, setConsumed] = useState<boolean>(true)
  const [firstSent, setFirstSent] = useState<boolean>(false)
  const coolref = useRef<number>(null)
  const [cooldown, setCooldown] = useState<number>(0)
  const [interval, setInterval] = useState<number>(0)
  const [userId, setUserId] = useState<string>()
  const [suffix, setSuffix] = useState('**')

  const coolItDown = () => {
    if (!cooldown && typeof coolref.current !== 'undefined') {
      coolref.current = 120
      if (interval) {
        window.clearInterval(interval)
      }

      setCooldown(coolref.current)
      const int = window.setInterval(() => {
        coolref.current -= 1
        setCooldown(coolref.current)
        if (cooldown <= 0 || coolref.current <= 0) {
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
    userId,
    setUserId,
    suffix,
    setSuffix,
    setCooldown,
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
  const [formValues, setFormValues] = useState<{ [k: string]: string }>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [processId, setProcessId] = useState<string>()
  const [loadingError, setLoadingError] = useState<string>()
  const [invalidCredentials, setInvalidCredentials] = useState<boolean>(false)
  const { setAlertMessage } = useMessageAlert()
  const { setWallet, wallet } = useWallet({ role: WalletRoles.VOTER })
  const { setAttempts, setConsumed, setUserId, setSuffix, setCooldown } = cspCtxt
  const {methods:adobe} = useAdobeAnalytics()

  const emptyFields = !formValues || Object.values(formValues).some(v => !v)

  const walletFromAuthData = (authFieldsData: string[], salt: string): Wallet => {
    const strPayload = importedRowToString(authFieldsData, salt)
    return digestedWalletFromString(strPayload)
  }

  const userIdFromAuthData = (authFieldsData: string[], salt: string): string => {
    const strPayload = importedRowToString(authFieldsData, salt)
    return digestedPrivateKeyFromString(strPayload)
  }

  const fieldNames = ['clauSoci', 'pin']
  const salt = '6jpC2cNVz7YrKA0MYFDIfjX9RYf5ZArQsJRdbk4jZNByzXQM8ZpCEMs8Xv7Hf7hQ'

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

      const uid = userIdFromAuthData(authFieldsData, salt)
      setUserId(uid)
      setLoading(true)
      setInvalidCredentials(false)

      const csp = new CSP(process.env.CSP_URL, process.env.CSP_PUB_KEY, process.env.CSP_API_VERSION)
      let electionId: string

      return await CspIndexer.getUserProcesses(strip0x(uid), csp)
        .then(processes => {
          if (processes.length != 1) throw new Error("No process found for user")
          const [ election ] = processes
          electionId = election["electionId"]
          setAttempts(Number(election.remainingAttempts))
          setConsumed(Boolean(election.consumed))
          setSuffix(election["extra"].join(''))
          setProcessId(electionId)
          setCooldown(0)

          let privateKey = localStorage.getItem(uid)
          let voterWallet: Wallet
          if (privateKey) {
            voterWallet = new Wallet(privateKey)
          } else {
            voterWallet = Wallet.createRandom()
            localStorage.setItem(uid, voterWallet.privateKey)
          }
          setWallet(voterWallet)

          // store clauSoci for adobe analytics
          // adobe.setUserId(authFieldsData[0])
          // store auth data in local storage for disconnect banner
          // setAuthFields(authFieldsData)
          const encryptedAuthfield = Symmetric.encryptString(authFieldsData.join("/"), voterWallet.publicKey)
          // store clauSoci for adobe analytics
          adobe.setUserId(authFieldsData[0])
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
