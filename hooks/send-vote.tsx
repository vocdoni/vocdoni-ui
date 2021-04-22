import { usePool, useProcess } from '@vocdoni/react-hooks'
import { CensusOffChainApi } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet } from './use-wallet'
import { Wallet } from 'ethers'
import i18n from '../i18n'
import { SendVotePageSteps } from '../components/steps-send-vote'
import { extractDigestedPubKeyFromString, importedRowToString } from '../lib/util'


export interface SendVoteContext {
  pageStep: SendVotePageSteps,
  processLoading: boolean,
  processError: string,
  sendVoteError: string,

  entityID: string,
  processID: string,

  sent: boolean,

  methods: {
    setProcessID(id: string): void,
    setFormID(id: string): void,
    setEntityAddress(id: string): void,
    setFields(fields: string[]): void,
    setFormValues(formValues: object): void,
  }
}

export const UseSendVoteContext = createContext<SendVoteContext>({ step: 0, methods: {} } as any)

export const useSendVote = (entityID: string, processID: string) => {
  const sendVoteCtx = useContext(UseSendVoteContext)
  if (sendVoteCtx === null) {
    throw new Error('useSendVote() can only be used on the descendants of <UseSendVoteProvider />,')
  }
  const { methods } = sendVoteCtx
  // TODO: how can I pass process ID to the provider code?
  methods.setProcessID(processID)

  return { ...sendVoteCtx, entityID, processID, }
}

export const UseSendVoteProvider = ({ children }: { children: ReactNode }) => {


  // FORM DATA
  const [formID, setFormID] = useState<string>("")
  const [fields, setFields] = useState<string[]>([])
  const [formValues, setFormValues] = useState({})
  const [entityAddress, setEntityAddress] = useState<string>("")
  const [processID, setProcessID] = useState<string>("")
  const { process, error: processError, loading: processLoading } = useProcess(processID)

  // UI STATE
  const { wallet, setWallet } = useWallet()
  const { poolPromise } = usePool()

  // UTIL

  useEffect(() => {
    setFields(formIDtoFieldNames(formID))
  }, [formID])


  // helper that extracts login fields
  const formIDtoFieldNames = (id: string): string[] => {
    return Buffer.from(id, 'base64').toString('utf8').split(',')
  }

  // hepler that converts form values to {privKey,digestebPubKey}
  const processFormValues = () => {
    const result: string[] = []
    for (const field of fields) {
      if (formValues[field]) {
        result.push(formValues[field])
      }
    }
    return extractDigestedPubKeyFromString(importedRowToString(result, entityAddress))
  }

  const ensureWallet = () => {
    if (wallet) {
      // Already OK?
      return Promise.resolve({ waitNext: false })
    }
    if (!entityAddress) return Promise.reject({ error: i18n.t('error.missing_entity_address') })

    if (processError) return Promise.reject({ error: i18n.t('error.cannot_load_process') })

    return poolPromise.then(pool => {
      const { privKey, digestedHexClaim } = processFormValues()
      const walletTemp = new Wallet(privKey)
      setWallet(walletTemp)
      return CensusOffChainApi.generateProof(
        process.parameters.censusRoot,
        { key: digestedHexClaim },
        true,
        pool)
    })
      .then(merkleProof => {
        if (merkleProof) return { waitNext: false }
        return { error: i18n.t('error.invalid_login') }
      })
      .catch(error => {
        console.error(error)
      })

  }

  const ensureSendVote: () => {

  }


  // RETURN VALUES
  const value: SendVoteContext = {
    processError,
    processLoading,

    methods: {
      setProcessID,
      setFormID,
      setEntityAddress,
      setFields,
      setFormValues,
    }
  }


  return (
    <UseSendVoteContext.Provider value={value}>
      {children}
    </UseSendVoteContext.Provider>
  )
}
