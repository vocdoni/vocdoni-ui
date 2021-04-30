import React, { useState } from 'react'

import i18n from '@i18n'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useAuthForm } from '@hooks/use-auth-form'
import { Loader } from '@components/loader'

import { VotingErrorPage, SignInForm } from '@components/pub/votes/auth/form'

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

  const handleSubmit = () => {
    setCheckingCredentials(true)

    methods.onLogin()
      .finally(() => {
        setCheckingCredentials(false)
      })
  }

  const renderLoadingPage = new ViewStrategy(
    () => loadingInfo,
    <Loader visible />
  )
  
  const renderVotingInvalidLink = new ViewStrategy(
    () => invalidProcessId,
    (
      <VotingErrorPage
        message={i18n.t(
          'vote.this_type_of_vote_is_not_supported_on_the_current_page'
        )}
      />
    )
  )

  const renderLoadingErrorPage = new ViewStrategy(
    () => !!loadingInfoError,
    <VotingErrorPage message={loadingInfoError} />
  )

  const renderVoteNotSupported = new ViewStrategy(
    () => !fieldNames || !fieldNames.length,
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
          onChange={methods.setFormValue}
          onSubmit={handleSubmit}
          submitEnabled={emptyFields}
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

export default VoteAuthLogin
