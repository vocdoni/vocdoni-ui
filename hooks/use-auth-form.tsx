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
} from 'dvote-js'
import { PREREGISTER_PATH, VOTING_PATH } from '../const/routes'
import i18n from '../i18n'
import { digestedWalletFromString, importedRowToString } from '../lib/util'
import { useMessageAlert } from './message-alert'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from './use-wallet'
import { utils } from 'ethers'
import { CensusPoof, ZKCensusPoof } from '@lib/types'
import { useSetRecoilState } from 'recoil'
import { censusProofState } from '@recoil/atoms/census-proof'
import { ZKcensusProofState } from '@recoil/atoms/zk-census-proof'
import { Wallet } from '@ethersproject/wallet'
import { useVoting } from '@hooks/use-voting'

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
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })
  const setCensusProof = useSetRecoilState<CensusPoof>(censusProofState)
  const setZKCensusProof = useSetRecoilState<ZKCensusPoof>(ZKcensusProofState)
  const processId = useUrlHash().slice(1) // Skip /
  const invalidProcessId = processId && !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo, refresh: refreshProcessInfo } = useProcess(processId)
  const { blockHeight } = useBlockHeight()
  const processStarted = blockHeight >= processInfo?.state?.startBlock
  const userRequirePreregister = processInfo?.state?.processMode?.preRegister && !processStarted
  const requireSecretKey = processInfo?.state?.processMode?.preRegister && processStarted
  const { setAlertMessage } = useMessageAlert()
  const [formValues, setFormValues] = useState<{ [k: string]: string }>({})
  const [authFields, setAuthFields] = useState<string[]>([])
  const [secretKey, setSecretKey] = useState<string>()
  const { methods: votingMethods } = useVoting(processId)

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

    if (requireSecretKey) {
      if (secretKey.length == 0) {
        setAlertMessage(i18n.t("errors.please_fill_in_all_the_fields"))
        return Promise.resolve()
      }

      const anonymousKey = calculateAnonymousKey(voterWallet.privateKey, secretKey, processInfo?.state?.entityId)
      return poolPromise.then(pool =>
        CensusOnChainApi.generateProof(processInfo?.state?.rollingCensusRoot, anonymousKey, pool)
      ).then(anonymousProof => {
        if (!anonymousProof) throw new Error("Invalid census proof")
        setZKCensusProof(anonymousProof)
        // Set the voter wallet recovered
        votingMethods.setAnonymousKey(anonymousKey)
        setWallet(voterWallet)

        if (userRequirePreregister) {
          router.push(PREREGISTER_PATH + "#/" + processInfo?.id)
        } else {
          router.push(VOTING_PATH + "#/" + processInfo?.id)
        }
      }).catch(err => {
        setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
      })
    } else {
      // calculate plain census claim, perform generateProof and redirect
      // according to anonymous o plain census
      const digestedHexClaim = CensusOffChain.Public.encodePublicKey(voterWallet.publicKey)

      return poolPromise.then(pool =>
        CensusOffChainApi.generateProof(processInfo.state?.censusRoot, { key: digestedHexClaim }, pool)
      ).then(censusProof => {
        if (!censusProof) throw new Error("Invalid census proof")
        setCensusProof(censusProof)
        // Set the voter wallet recovered
        setWallet(voterWallet)

        if (userRequirePreregister) {
          router.push(PREREGISTER_PATH + "#/" + processInfo?.id)
        } else {
          router.push(VOTING_PATH + "#/" + processInfo?.id)
        }
      }).catch(err => {
        setAlertMessage(i18n.t("errors.the_contents_you_entered_may_be_incorrect"))
      })
    }
  }

  const walletFromAuthData = (authFieldsData: string[], entityId: string): Wallet => {
    authFieldsData = authFieldsData.map(x => normalizeText(x))
    const strPayload = importedRowToString(authFieldsData, entityId)
    return digestedWalletFromString(strPayload)
  }



  const calculateAnonymousKey = (privKey: string, password: string, entityId): bigint => {
    return bufferToBigInt(Buffer.from(importedRowToString([password, privKey], entityId), "utf-8")) % Poseidon.Q
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
    authFields,
    secretKey,

    methods: {

      setFormValue,
      onLogin,
      setSecretKey,
      calculateAnonymousKey
    }
  }
  return value
}
