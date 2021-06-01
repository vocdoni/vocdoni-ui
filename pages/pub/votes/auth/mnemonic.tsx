import React, { useState } from 'react'
import { useEntity } from '@vocdoni/react-hooks'
import { useMessageAlert } from '@hooks/message-alert'
import { ethers, Wallet } from 'ethers'


import i18n from '@i18n'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { useAuthKey } from '@hooks/use-auth-key'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { Loader } from '@components/loader'
import { VotingErrorPage } from '@components/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/layout/voter'
import { Redirect } from '@components/redirect'

import { VOTING_PATH } from '@const/routes'
import { MnemonicForm } from '@components/pub/votes/auth/link/mnemonic'
import { langCa as wordListCa } from "@lib/wordlist-ca"


// NOTE: This page uses a custom Layout. See below.

const VoteAuthMnemonic = () => {
  const {
    invalidKey,
    invalidProcessId,
    loadingInfo,
    loadingInfoError,
    processInfo,
    processId,
    key,
  } = useAuthKey()
  const { setAlertMessage } = useMessageAlert()
  const [mnemonic, setMnemonic] = useState<string>(null)
  const [invalidWordIndex, setInvalidWordIndex] = useState<number>(0)
  const [privateKey, setPrivateKey] = useState<string>(null)
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata, loading, error } = useEntity(processInfo?.entity)

  const ETH_PATH = "m/44'/60'/0'/0/1"
  const wordList: string[] = []
  for (let i = 0; i < 2048; i++) wordList.push(wordListCa.getWord(i))

  const HEX_REGEX = /^(0x)?[0-9a-fA-F]+$/

  const onChange = (newMnemonic: string) => {
    const inputWords = mnemonic.trim().split(" ").map(w => w.trim()).filter(w => !!w)
    setMnemonic(mnemonic)
    for (let i = 0; i < inputWords.length; i++) {
      if (!wordList.includes(inputWords[i])) {
        setInvalidWordIndex(i)
        setPrivateKey(null)
      }
    }

    try {
      const wallet = Wallet.fromMnemonic(newMnemonic.trim().toLowerCase(), ETH_PATH, wordListCa)
      setInvalidWordIndex(-1)
      setPrivateKey(wallet.privateKey)
    }
    catch (err) {
      setInvalidWordIndex(-1)
      setPrivateKey(null)
    }

  }

  const onSubmit = () => {
    if (!privateKey) {
      setAlertMessage(i18n.t('errors.invalid_mnemonic'))
    }




  }
  const renderLoadingPage = new ViewStrategy(() => true, <Loader visible />)

  const renderVotingInvalidLink = new ViewStrategy(
    () => !loading && !loadingInfo && invalidProcessId && invalidKey,
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.this_type_of_vote_is_not_supported_on_the_current_page'
        )}
      />
    )
  )

  const renderLoadingErrorPage = new ViewStrategy(
    () => !!loadingInfoError || !!error,
    <VotingErrorPage message={loadingInfoError} />
  )

  const renderVoteNotSupported = new ViewStrategy(
    () => !loading && !loadingInfo && !key,
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.this_type_of_vote_is_not_supported_on_the_current_page'
        )}
      />
    )
  )

  const renderForm = new ViewStrategy(
    () => !!wallet && !!privateKey,
    (
      <>
        <Loader visible />
        <div>
          <Loader visible={loadingInfo} />
          <MnemonicForm
            mnemonic={mnemonic}
            processInfo={processInfo}
            entity={metadata}
            onChange={onChange}
            onSubmit={onSubmit}
            submitEnabled={!privateKey}
          />
        </div>
      </>
    )
  )

  const renderVote = new ViewStrategy(
    () => !!wallet && privateKey.length > 0,
    (
      <>
        <Loader visible />
        <Redirect to={VOTING_PATH + '#/' + processId} />
      </>
    )
  )

  const viewContext = new ViewContext([
    renderLoadingErrorPage,
    renderVotingInvalidLink,
    renderVoteNotSupported,
    renderForm,
    renderLoadingPage,
    renderVote,
  ])

  return viewContext.getView()
}

// Defining the custom layout to use
VoteAuthMnemonic['Layout'] = LayoutVoter

export default VoteAuthMnemonic

