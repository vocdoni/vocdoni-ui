import { useEffect } from 'react'
import { Wallet } from 'ethers'
import { usePool } from '@vocdoni/react-hooks'
import { useProcessWrapper } from "@hooks/use-process-wrapper"
import { useDbVoters } from './use-db-voters'
import { InvalidIncognitoModeError } from '@lib/validators/errors/invalid-incognito-mode-error'

import {
  ProcessDetails,
  CensusOffChainApi,
  CensusOffChain,
  Symmetric,

} from 'dvote-js'

import i18n from '../i18n'
import { useMessageAlert } from './message-alert'
import { useUrlHash } from 'use-url-hash'
import { useSetRecoilState } from 'recoil'
import { censusProofState } from '@recoil/atoms/census-proof'
import { useWallet, WalletRoles } from './use-wallet'
import { CensusPoof } from '@lib/types'

// CONTEXT

type IAuthKey = {
  invalidKey?: boolean
  invalidProcessId?: boolean
  loadingInfo?: boolean
  loadingInfoError?: string
  processInfo?: ProcessDetails
  processId: string
  key?: string
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useAuthKey = () => {
  const { poolPromise } = usePool()
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })
  const setCensusProof = useSetRecoilState<CensusPoof>(censusProofState)
  const { addVoter, getVoter } = useDbVoters()

  const processId = useUrlHash().slice(1).split('/')[0] // Skip /
  const key = useUrlHash().slice(1).split('/')[1] // Skip /
  // TODO make invalid key function smarter
  const invalidKey = !key

  const invalidProcessId = processId && !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const {
    loadingInfo,
    loadingInfoError,
    processInfo,
  } = useProcessWrapper(processId)

  const { setAlertMessage } = useMessageAlert()

  const getCensusProf = async (process: string) => {
    if (processInfo) {
      if (!key) {
        setAlertMessage(i18n.t('errors.invalid_link'))
      }

      try {
        console.log(key)
        const voterWallet = new Wallet(key)

        const digestedHexClaim = CensusOffChain.Public.encodePublicKey(
          voterWallet.publicKey
        )

        const pool = await poolPromise

        const censusProof = await CensusOffChainApi.generateProof(
          processInfo.state?.censusRoot,
          { key: digestedHexClaim },
          pool
        )

        if (!censusProof) throw new Error('Invalid census proof')
        setCensusProof(censusProof)
        // Set the voter wallet recovered
        setWallet(voterWallet)
        let voter = getVoter(voterWallet.address, processInfo.id)
        const encryptedAuthfield = Symmetric.encryptString("", voterWallet.privateKey)
        // store auth data in local storage for disconnect banner
        localStorage.setItem('voterData', encryptedAuthfield)

        if (!voter) {
          try {
            await addVoter({
              address: voterWallet.address,
              processId: processInfo.id,
              // loginData: encryptedAuthfield,
            })
          } catch (error) {
            if (error?.message?.indexOf?.("mutation") >= 0) { // if is incognito mode throw these error
              throw new InvalidIncognitoModeError()
            }
            throw new Error(error)
          }
        }
      } catch (error) {
        console.log(error)
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
