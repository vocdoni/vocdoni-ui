import React, { useEffect } from 'react'
import { useEntity } from '@vocdoni/react-hooks'
import { useTranslation } from 'react-i18next'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { useAuthKey } from '@hooks/use-auth-key'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { Loader } from '@components/blocks/loader'
import { VotingErrorPage } from '@components/pages/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/pages/app/layout/voter'
import { Redirect } from '@components/redirect'

import { VOTING_PATH } from '@const/routes'
import { useVoting } from '@hooks/use-voting'

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
  const { i18n } = useTranslation()
  const { methods: votingMethods } = useVoting(processId)
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { loading, error } = useEntity(processInfo?.state?.entityId)

  useEffect(() => {
    votingMethods.cleanup()
  }, [])

  const renderLoadingPage = new ViewStrategy(() => true, <Loader visible />)

  const renderVotingInvalidLink = new ViewStrategy(
    () => !loading && !loadingInfo && invalidProcessId && invalidKey,
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.invalid_process_id_or_key'
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
