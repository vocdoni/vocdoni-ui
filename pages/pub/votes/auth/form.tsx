import React, { useState } from 'react'
import { useEntity } from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useAuthForm } from '@hooks/use-auth-form'
import { Loader } from '@components/loader'

import { SignInForm } from '@components/pub/votes/auth/form/sign-in-form'
import { VotingErrorPage } from '@components/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/layout/voter'

// NOTE: This page uses a custom Layout. See below.

const VoteAuthLogin = () => {
  const [checkingCredentials, setCheckingCredentials] = useState<boolean>(false)
  const {
    invalidProcessId,
    loadingInfo,
    loadingInfoError,
    emptyFields,
    fieldNames,
    formValues,
    processInfo,
    methods,
  } = useAuthForm()
  const { metadata, loading, error } = useEntity(processInfo?.state?.entityId)

  const handleSubmit = () => {
    setCheckingCredentials(true)

    methods.onLogin()
      .finally(() => {
        setCheckingCredentials(false)
      })
  }

  const renderLoadingPage = new ViewStrategy(
    () => loadingInfo || loading,
    <Loader visible />
  )

  const renderVotingInvalidLink = new ViewStrategy(
    () => (!loading && !loadingInfo) && invalidProcessId,
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
    () => (!loading && !loadingInfo) && (!fieldNames || !fieldNames?.length),
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.this_type_of_vote_is_not_supported_on_the_current_page'
        )}
      />
    )
  )

  const renderForm = new ViewStrategy(
    () => true,
    (
      <div>
        <Loader visible={loadingInfo} />
        <SignInForm
          checkingCredentials={checkingCredentials}
          fields={fieldNames}
          values={formValues}
          processInfo={processInfo}
          entity={metadata}
          onChange={methods.setFormValue}
          onSubmit={handleSubmit}
          submitEnabled={!emptyFields}
        />
      </div>
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
