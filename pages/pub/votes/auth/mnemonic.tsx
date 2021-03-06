import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useEntity, useProcess } from '@vocdoni/react-hooks'
import { useMessageAlert } from '@hooks/message-alert'
import { useUrlHash } from 'use-url-hash'
import { Wallet, ethers, Wordlist } from 'ethers'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { useAuth } from '@hooks/use-auth'

import { Loader } from '@components/blocks/loader'
import { VotingErrorPage } from '@components/pages/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/pages/app/layout/voter'
import { MnemonicForm } from '@components/pages/pub/votes/auth/mnemonic'

import { InvalidMnemonicError } from '@lib/validators/errors/invalid-mnemonic-error'
import { NoCensusMemberError } from '@lib/validators/errors/no-census-member-error'
import { langCa as wordListCa } from '@lib/wordlist-ca'
import { Redirect } from '@components/redirect'
import { VOTING_PATH } from '@const/routes'
import { ETH_PATH } from '@const/eth'
import { useVoting } from '@hooks/use-voting'

// NOTE: This page uses a custom Layout. See below.
const wordListEs = ethers.wordlists['es']
const wordListEn = ethers.wordlists['en']

const VoteAuthMnemonic = () => {
  const { i18n } = useTranslation()

  const { setWallet, wallet } = useWallet({ role: WalletRoles.VOTER })

  const [mnemonic, setMnemonic] = useState<string>(null)
  const [processId, setProcessId] = useState<string>('')
  const [mnemonicError, setMnemonicError] = useState<string>()
  const [invalidProcessId, setInvalidProcessId] = useState<boolean>(false)
  const [validating, setValidating] = useState<boolean>(false)
  const { methods: votingMethods } = useVoting(processId)

  const urlHash = useUrlHash() // Skip /

  useEffect(() => {
    votingMethods.cleanup()
  }, [])

  useEffect(() => {
    if (urlHash) {
      const process = urlHash.slice(1).split('/')[0]
      const invalidProcess = !process || !process.match(/^0x[0-9a-fA-F]{64}$/)

      setProcessId(process)
      setInvalidProcessId(invalidProcess)
    }
  }, [urlHash])

  const {
    loading: loadingInfo,
    error: loadingInfoError,
    process: processInfo,
  } = useProcess(processId)
  const { checkCensusProof } = useAuth()
  const { metadata, loading, error } = useEntity(processInfo?.state?.entityId)

  const getWalletFromWordList = (
    newMnemonic: string,
    wordlist: Wordlist,
    lang
  ) => {
    const splittedMnemonic = newMnemonic
      .trim()
      .split(' ')
      .map((w) => w.trim())
      .filter((w) => !!w)

    for (let i = 0; i < splittedMnemonic.length; i++) {
      if (wordlist.getWordIndex(splittedMnemonic[i]) === -1) {
        return undefined
      }
    }

    return Wallet.fromMnemonic(
      newMnemonic.trim().toLowerCase(),
      ETH_PATH,
      wordlist
    )
  }

  const getWalletFromMnemonic = (newMnemonic: string) => {
    const wallet =
      getWalletFromWordList(newMnemonic, wordListCa, 'ca') ||
      getWalletFromWordList(newMnemonic, wordListEn, 'en') ||
      getWalletFromWordList(newMnemonic, wordListEs, 'es')

    if (!wallet) {
      throw new InvalidMnemonicError()
    }

    return wallet
  }

  const handleOnChange = (newMnemonic: string) => {
    setMnemonic(newMnemonic)
  }

  const handleOnSubmit = async () => {
    setValidating(true)

    try {
      const wallet = getWalletFromMnemonic(mnemonic)
      setMnemonicError('')

      checkCensusProof(
        processInfo.state?.censusRoot,
        wallet.privateKey
      )

      setWallet(wallet)
    } catch (error) {
      if (error instanceof NoCensusMemberError) {
        setMnemonicError(error.message)
      } else {
        setMnemonicError(i18n.t('vote.invalid_mnemonic_value'))
      }

      setValidating(false)
    }
  }

  const handleOnBlur = () => {
    setMnemonicError('')

    try {
      getWalletFromMnemonic(mnemonic)
    } catch (error) {
      setMnemonicError(i18n.t('vote.invalid_mnemonic_value'))
    }
  }

  const renderLoadingPage = new ViewStrategy(() => true, <Loader visible />)

  const renderVotingInvalidLink = new ViewStrategy(
    () => !loading && !loadingInfo && !!loadingInfoError,
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.this_type_of_vote_is_not_supported_on_the_current_page'
        )}
      />
    )
  )

  const renderInvalidProcessId = new ViewStrategy(
    () => invalidProcessId,
    <VotingErrorPage message={i18n.t('vote.invalid_process_id_link')} />
  )

  const renderLoadingErrorPage = new ViewStrategy(
    () => !!loadingInfoError || !!error,
    <VotingErrorPage message={loadingInfoError} />
  )

  const renderForm = new ViewStrategy(
    () => !!processInfo,
    (
      <>
        {!!wallet && <Redirect to={VOTING_PATH + '#/' + processId} />}
        <MnemonicForm
          mnemonic={mnemonic}
          processInfo={processInfo}
          entity={metadata}
          error={mnemonicError}
          onChange={handleOnChange}
          onBlur={handleOnBlur}
          onSubmit={handleOnSubmit}
          submitEnabled={!validating}
        />
      </>
    )
  )

  const viewContext = new ViewContext([
    renderInvalidProcessId,
    renderForm,
    renderLoadingErrorPage,
    renderVotingInvalidLink,
    renderLoadingPage,
  ])

  return viewContext.getView()
}

// Defining the custom layout to use
VoteAuthMnemonic['Layout'] = LayoutVoter

export default VoteAuthMnemonic
