import { usePool, useProcess } from '@vocdoni/react-hooks'
import { CensusOffChainApi } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet } from './use-wallet'
import { Wallet } from 'ethers'
import i18n from '../i18n'
import { VotingPageSteps } from '../components/steps-voting'
import { extractDigestedPubKeyFromString, importedRowToString } from '../lib/util'
import { StepperFunc } from '../lib/types'


export interface VotingContext {
  pageStep: VotingPageSteps,
  processLoading: boolean,
  processError: string,
  votingError: string,

  entityID: string,
  processID: string,

  sent: boolean,

  methods: {
    setProcessID(id: string): void,
    setFormID(id: string): void,
    setEntityAddress(id: string): void,
    setFields(fields: string[]): void,
    setFormValues(formValues: string[]): void,
  }
}

export const UseVotingContext = createContext<VotingContext>({ step: 0, methods: {} } as any)

export const useVoting = () => {
  const votingCtx = useContext(UseVotingContext)
  if (votingCtx === null) {
    throw new Error('useVoting() can only be used on the descendants of <UsevotingProvider />,')
  }
  return votingCtx
}

export const UseVotingProvider = ({ children }: { children: ReactNode }) => {

  // FORM DATA
  const [formID, setFormID] = useState<string>("")
  const [fields, setFields] = useState<string[]>([])
  const [formValues, setFormValues] = useState({})
  const [entityAddress, setEntityAddress] = useState<string>("")
  const [processID, setProcessID] = useState<string>("")
  const { process, error: processError, loading: processLoading } = useProcess(processID)

  // UI STATE
  const { wallet, setWallet } = useWallet({ voter: true })
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

    // TODO: Normalize strings
    // SEE https://github.com/vocdoni/protocol/discussions/19

    return extractDigestedPubKeyFromString(importedRowToString(result, entityAddress))
  }

  const ensureMerkleProof = () => {
    // if (wallet) {
    //   // Already OK?
    //   return Promise.resolve({ waitNext: false })
    // }
    // if (!entityAddress) return Promise.reject({ error: i18n.t('error.missing_entity_address') })

    // if (processError) return Promise.reject({ error: i18n.t('error.cannot_load_process') })

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

  const ensureVoteDelivery: StepperFunc = () => {

  }


  // RETURN VALUES
  const value: VotingContext = {
    processError,
    processLoading,

    methods: {
      setProcessID,
      setFormID,
      setEntityAddress,
      setFields,
      setFormValues,

      ensureVoteDelivery
    }
  }


  return (
    <UseVotingContext.Provider value={value}>
      {children}
    </UseVotingContext.Provider>
  )
}
