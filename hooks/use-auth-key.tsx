import { useState } from 'react'
import { usePool, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { IProcessInfo, CensusOffChainApi, CensusOffchainDigestType, normalizeText } from 'dvote-js'
import { VOTING_PATH } from '../const/routes'
import i18n from '../i18n'
import { digestedWalletFromString, importedRowToString } from '../lib/util'
import { useMessageAlert } from './message-alert'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from './use-wallet'
import { utils, Wallet } from 'ethers'

// CONTEXT

type IAuthKey = {
  invalidKey?: boolean,
  invalidProcessId?: boolean,
  loadingInfo?: boolean,
  loadingInfoError?: string,
  processInfo?: IProcessInfo,
  key?: string,

  methods: {
    // setKey (key: string) => void,
    onLogin: () => Promise<void>
  }
}

/** Provides the currently available wallet for the admin (by default) or for the voter otherwise  */
export const useAuthKey = () => {
  const router = useRouter()
  const { poolPromise } = usePool()
  const { setWallet } = useWallet({ role: WalletRoles.VOTER })
  const processId = useUrlHash().slice(1).split('/')[0] // Skip /
  const key = useUrlHash().slice(1).split('/')[1] // Skip /
  // TODO make invalid key function smarter
  const invalidKey = (!key)
  console.log(processId,'\n',key)
  const invalidProcessId = processId && !processId.match(/^0x[0-9a-fA-F]{64}$/)
  const { loading: loadingInfo, error: loadingInfoError, process: processInfo } = useProcess(processId)
  const { setAlertMessage } = useMessageAlert()



  const onLogin = (): Promise<void> => {
    if (!key) {
      setAlertMessage(i18n.t("errors.invalid_link"))
      return Promise.resolve()
    }
    const voterWallet = new Wallet(key)
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


  const value: IAuthKey = {
    invalidKey,
    loadingInfo,
    loadingInfoError,
    processInfo,
    invalidProcessId,
    key,

    methods: {
      onLogin
    }
  }
  return value
}
