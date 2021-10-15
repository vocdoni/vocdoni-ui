import React, { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { overrideTheme } from 'theme'
import { EntityMetadata } from 'dvote-js'

import { useEntity } from '@vocdoni/react-hooks'


import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useAuthForm } from '@hooks/use-auth-form'
import { useTheme } from '@hooks/use-theme'

import { Loader } from '@components/blocks/loader'
import { SignInForm } from '@components/pages/pub/votes/auth/sign-in-form'
import { VotingErrorPage } from '@components/pages/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/pages/app/layout/voter'
import { MetadataFields } from '@components/pages/votes/new/metadata'
// NOTE: This page uses a custom Layout. See below.

const VoteAuthLogin = () => {
  const { i18n } = useTranslation()

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
  const { updateAppTheme } = useTheme();

  const entityMetadata = metadata as EntityMetadata

  useEffect(() => {
    if (processInfo?.metadata?.meta?.[MetadataFields.BrandColor] || entityMetadata?.meta?.[MetadataFields.BrandColor]) {
      const brandColor = processInfo?.metadata?.meta?.[MetadataFields.BrandColor] || entityMetadata?.meta?.[MetadataFields.BrandColor]

      updateAppTheme({
        accent1: brandColor,
        accent1B: brandColor,
        accent2: brandColor,
        accent2B: brandColor,
        textAccent1: brandColor,
        textAccent1B: brandColor,
        customLogo: entityMetadata.media?.logo
      })
    }
  }, [processInfo, entityMetadata])

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

  return viewContext.getView()
}

// Defining the custom layout to use
VoteAuthLogin["Layout"] = LayoutVoter

export default VoteAuthLogin
