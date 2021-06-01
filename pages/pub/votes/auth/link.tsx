import React, { useState } from 'react'
import { useEntity } from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { useAuthKey } from '@hooks/use-auth-key'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { Loader } from '@components/loader'
import { VotingErrorPage } from '@components/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/layout/voter'
import { Redirect } from '@components/redirect'

import { VOTING_PATH } from '@const/routes'

// NOTE: This page uses a custom Layout. See below.

const VoteAuthLogin = () => {
  const {
    invalidKey,
    invalidProcessId,
    loadingInfo,
    loadingInfoError,
    processInfo,
    processId,
    key,
  } = useAuthKey()
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { loading, error } = useEntity(processInfo?.entity)

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
    () => !!wallet,
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
  ])

  return viewContext.getView()
}

// Defining the custom layout to use
VoteAuthLogin['Layout'] = LayoutVoter

export default VoteAuthLogin
