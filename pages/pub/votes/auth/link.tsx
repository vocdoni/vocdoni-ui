import React, { useState } from 'react'
import { useEntity } from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useAuthKey } from '@hooks/use-auth-key'
import { Loader } from '@components/loader'

import { VotingErrorPage, SignInForm } from '@components/pub/votes/auth/form'
import { LayoutVoter } from '@components/layout/voter'
import { useUrlHash } from 'use-url-hash'

// NOTE: This page uses a custom Layout. See below.

const VoteAuthLogin = () => {
  const [checkingCredentials, setCheckingCredentials] = useState<boolean>(false)
  const {
    invalidKey,
    invalidProcessId,
    loadingInfo,
    loadingInfoError,
    processInfo,
    methods,
    key
  } = useAuthKey()
  const { loading, error } = useEntity(processInfo?.entity)

  const login = () => {
    setCheckingCredentials(true)

  methods.onLogin()
    .finally(() => {
      setCheckingCredentials(false)
    })
  return true
  }

  const renderLoadingPage = new ViewStrategy(
    () => loadingInfo || loading || checkingCredentials,
    <Loader visible />
  )

  const renderVotingInvalidLink = new ViewStrategy(
    () => (!loading && !loadingInfo) && invalidProcessId && invalidKey,
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
    () => (!loading && !loadingInfo) && (!key),
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.this_type_of_vote_is_not_supported_on_the_current_page'
        )}
      />
    )
  )

  const renderForm = new ViewStrategy(
    () => (login() ),
    (
      <Loader visible />
    )
  )

  const viewContext = new ViewContext([
    renderLoadingPage,
    renderLoadingErrorPage,
    renderVotingInvalidLink,
    renderVoteNotSupported,
    renderForm,
  ])

  return <>{viewContext.getView()}</>
}

// Defining the custom layout to use
VoteAuthLogin["Layout"] = LayoutVoter

export default VoteAuthLogin
