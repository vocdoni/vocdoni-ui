import { usePool, useProcess } from '@vocdoni/react-hooks'
import { CensusOffChainApi } from 'dvote-js'
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { useWallet, WalletRoles } from './use-wallet'
import i18n from '../i18n'
import { VotingPageSteps } from '../components/steps-voting'
import { StepperFunc } from '../lib/types'
import { useStepper } from './use-stepper'

export interface VotingContext {
  pleaseWait: boolean,
  actionStep: number,
  actionError?: string,
  pageStep: VotingPageSteps,
  processLoading: boolean,
  processLoadingError: string,
  votingError: string,

  entityID: string,
  processID: string,

  // sent: boolean,

  methods: {
    setProcessID(id: string): void,
    setEntityAddress(id: string): void,

    submitVote: () => Promise<void>,
    continueSubmitVote: () => Promise<void>
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
  const { process, error: processLoadingError, loading: processLoading } = useProcess(processID)

  // UI STATE
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const { poolPromise } = usePool()

  // UTIL

  const ensureMerkleProof: StepperFunc = () => {
    // if (wallet) {
    //   // Already OK?
    //   return Promise.resolve({ waitNext: false })
    // }
    // if (!entityAddress) return Promise.reject({ error: i18n.t('error.missing_entity_address') })

    // if (processLoadingError) return Promise.reject({ error: i18n.t('error.cannot_load_process') })

    return poolPromise
      .then(pool => {

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
  }

  const ensureVoteDelivery: StepperFunc = () => {

  }

  // Enumerate all the steps needed to create an entity
  const creationStepFuncs = [ensureMerkleProof, ensureVoteDelivery]

  const creationStepper = useStepper(creationStepFuncs, 0)
  const { actionStep, pleaseWait, creationError, doMainActionSteps } = creationStepper


  // RETURN VALUES
  const value: VotingContext = {
    actionStep,
    pleaseWait,
    actionError: creationError,
    processLoadingError,
    processLoading,

    methods: {
      setProcessID,
      setEntityAddress,

      submitVote: doMainActionSteps,
      continueSubmitVote: doMainActionSteps
    }
  }


  return (
    <UseVotingContext.Provider value={value}>
      {children}
    </UseVotingContext.Provider>
  )
}
