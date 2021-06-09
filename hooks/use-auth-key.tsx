import { useEffect } from 'react'
import { Wallet } from 'ethers'
import { usePool, useProcess } from '@vocdoni/react-hooks'

import {
  IProcessDetails,
  CensusOffChainApi,
  CensusOffchainDigestType,
} from 'dvote-js'

import i18n from '../i18n'
import { useMessageAlert } from './message-alert'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from './use-wallet'

// CONTEXT

type IAuthKey = {
  invalidKey?: boolean
  invalidProcessId?: boolean
  loadingInfo?: boolean
  loadingInfoError?: string
  processInfo?: IProcessDetails
  processId: string
  key?: string
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useAuthKey = () => {
  const { poolPromise } = usePool()
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })
  const processId = useUrlHash().slice(1).split('/')[0] // Skip /
  const key = useUrlHash().slice(1).split('/')[1] // Skip /
  // TODO make invalid key function smarter
  const invalidKey = !key

  const invalidProcessId = processId && !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const {
    loading: loadingInfo,
    error: loadingInfoError,
    process: processInfo,
  } = useProcess(processId)

  const { setAlertMessage } = useMessageAlert()

  const getCensusProf = async (process: string) => {
    if (processInfo) {
      if (!key) {
        setAlertMessage(i18n.t('errors.invalid_link'))
      }

      try {
        const voterWallet = new Wallet(key)

        const digestedHexClaim = CensusOffChainApi.digestPublicKey(
          voterWallet.publicKey,
          CensusOffchainDigestType.RAW_PUBKEY
        )

        const pool = await poolPromise

        const censusProof = await CensusOffChainApi.generateProof(
          processInfo.state?.censusRoot,
          { key: digestedHexClaim },
          false,
          pool
        )

        if (!censusProof) throw new Error('Invalid census proof')

        // Set the voter wallet recovered
        setWallet(voterWallet)
      } catch (error) {

        setAlertMessage(
          i18n.t('errors.the_contents_you_entered_may_be_incorrect')
        )
      }
    }
  }

  useEffect(() => {
    getCensusProf(processId)
  }, [processInfo])

  const value: IAuthKey = {
    invalidKey,
    loadingInfo,
    loadingInfoError,
    processInfo,
    invalidProcessId,
    processId,
    key,
  }

  return value
}
