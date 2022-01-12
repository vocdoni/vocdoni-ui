import { useState } from 'react'
import { usePool, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { ProcessDetails, CensusOffChain, CensusOffChainApi, normalizeText } from 'dvote-js'
import { VOTING_PATH } from '../const/routes'
import i18n from '../i18n'
import { digestedWalletFromString, importedRowToString } from '../lib/util'
import { useMessageAlert } from './message-alert'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from './use-wallet'
import { utils } from 'ethers'
import { CensusPoof } from '@lib/types'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { censusProofState } from '@recoil/atoms/census-proof'

// CONTEXT

type IAuthForm = {
  emptyFields?: boolean,
  invalidProcessId?: boolean,
  loadingInfo?: boolean,
  loadingInfoError?: string,
  processInfo?: ProcessDetails,
  fieldNames: string[],
  formValues: { [k: string]: string },

  methods: {
    setFormValue: (key: string, value: string) => void,
    onLogin: () => Promise<void | number>
  }
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useAuthForm = () => {
  const router = useRouter()
  const { poolPromise } = usePool()
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })
  const setCensusProof = useSetRecoilState<CensusPoof>(censusProofState)
  const processId = useUrlHash().slice(1) // Skip /
  const invalidProcessId = processId && !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo } = useProcess(processId)
  const { setAlertMessage } = useMessageAlert()
  const [formValues, setFormValues] = useState<{ [k: string]: string }>({})

  const fieldNames: string[] = processInfo?.metadata?.meta?.formFieldTitles || []

  const setFormValue = (key: string, value: string) => {
    if (!fieldNames.includes(key)) return

    const newValue = Object.assign({}, formValues)
    newValue[key] = value
    setFormValues(newValue)
  }


  const onLogin = (): Promise<void | number> => {
    let authFields: string[] = []
    for (const fieldName of fieldNames) {
      if (!formValues[fieldName]) {
        setAlertMessage(i18n.t("errors.please_fill_in_all_the_fields"))
        return Promise.resolve()
      }

      authFields.push(formValues[fieldName])
    }

    const entityId = utils.getAddress(processInfo.state?.entityId)
    authFields = authFields.map(x => normalizeText(x))


    const strPayload = importedRowToString(authFields, entityId)
    const voterWallet = digestedWalletFromString(strPayload)
    const digestedHexClaim = CensusOffChain.Public.encodePublicKey(voterWallet.publicKey)

    return poolPromise.then(pool =>
      CensusOffChainApi.generateProof(processInfo.state?.censusRoot, digestedHexClaim, false, pool)
    ).then(censusProof => {
      if (!censusProof) throw new Error("Invalid census proof")
      setCensusProof(censusProof)
      // Set the voter wallet recovered
      setWallet(voterWallet)

      // store data in localstorage to be able to show the disconnect modal correctly
      let anonymizedAuthFields = []
      let iter = 0
      authFields.every((authField) => {
        if (iter >= 3) {
          return false
        }
        let anonymizedAuthField
        iter = iter + 1
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (authField.toLocaleLowerCase().match(emailRegex)) {
          anonymizedAuthField = `${authField[0]}...${authField.split('@')[1]}`
        } else if (authField.length >= 3) {
          const visibleStrLength = Math.floor(Math.sqrt(authField.length))
          anonymizedAuthField = `${authField.substring(0, visibleStrLength)}...${authField.substring(authField.length - visibleStrLength - 1, visibleStrLength)}`
        } else {
          anonymizedAuthField = authField
        }
        anonymizedAuthFields.push(anonymizedAuthField)
        return true
      })
      localStorage.setItem('voterData', anonymizedAuthFields.join(" / "))

      // Go there
      router.push(VOTING_PATH + "#/" + processId)
    }).catch(err => {
      setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
    })
  }

  const emptyFields = !formValues || Object.values(formValues).some(v => !v)

  const value: IAuthForm = {
    loadingInfo,
    loadingInfoError,
    processInfo,
    emptyFields,
    invalidProcessId,
    fieldNames,
    formValues,

    methods: {

      setFormValue,
      onLogin
    }
  }
  return value
}
