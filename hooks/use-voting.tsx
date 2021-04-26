import { usePool, useProcess } from '@vocdoni/react-hooks'
import { CensusOffChainApi } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet, WalletRoles } from './use-wallet'
import i18n from '../i18n'
import { VotingPageSteps } from '../components/steps-voting'
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
    setEntityAddress(id: string): void,
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
  const [entityAddress, setEntityAddress] = useState<string>("")
  const [processID, setProcessID] = useState<string>("")
  const { process, error: processError, loading: processLoading } = useProcess(processID)

  // UI STATE
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const { poolPromise } = usePool()

  // UTIL

  const ensureMerkleProof = () => {
    // if (wallet) {
    //   // Already OK?
    //   return Promise.resolve({ waitNext: false })
    // }
    // if (!entityAddress) return Promise.reject({ error: i18n.t('error.missing_entity_address') })

    // if (processError) return Promise.reject({ error: i18n.t('error.cannot_load_process') })

    return poolPromise.then(pool => {

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
      setEntityAddress,

      ensureVoteDelivery
    }
  }


  return (
    <UseVotingContext.Provider value={value}>
      {children}
    </UseVotingContext.Provider>
  )
}
