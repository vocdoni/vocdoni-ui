import { useState, createContext, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { CensusOffChainApi, CensusOffchainDigestType } from 'dvote-js'
import { VOTING_PATH } from '../const/routes'
import i18n from '../i18n'
import { digestedWalletFromString, importedRowToString, normalize } from '../lib/util'
import { useMessageAlert } from './message-alert'
import { usePool, useProcess } from '@vocdoni/react-hooks'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from './use-wallet'
import { ProcessInfo } from '../lib/types'
import { utils } from 'ethers'

// CONTEXT

type IAuthForm = {
  emptyFields?: boolean,
  invalidProcessId?: boolean,
  loadingInfo?: boolean,
  loadingInfoError?: string,
  processInfo?: ProcessInfo,
  fieldNames: string[],
  formValues: { [k: string]: string },

  methods: {
    setFormValue: (key: string, value: string) => void,
    onLogin: () => void
  }
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useAuthForm = () => {
  const router = useRouter()
  const { poolPromise } = usePool()
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })
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

  const onLogin =  () => {
    let authFields: string[] = []
    for (const fieldName of fieldNames) {
      if (!formValues[fieldName]) return setAlertMessage(i18n.t("errors.please_fill_in_all_the_fields"))

      // TODO: Normalize strings
      // SEE https://github.com/vocdoni/protocol/discussions/19

      authFields.push(formValues[fieldName])
    }

    const entityId = utils.getAddress(processInfo.entity)
    authFields = authFields.map(x => normalize(x))
    const strPayload = importedRowToString(authFields, entityId)
    const voterWallet = digestedWalletFromString(strPayload)
    const digestedHexClaim = CensusOffChainApi.digestPublicKey(voterWallet.publicKey, CensusOffchainDigestType.RAW_PUBKEY)

    return poolPromise.then(pool =>
      CensusOffChainApi.generateProof(processInfo.parameters.censusRoot, { key: digestedHexClaim }, false, pool)
    ).then(censusProof => {
      if (!censusProof) throw new Error("Invalid census proof")

      // Set the voter wallet recovered
      setWallet(voterWallet)

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
