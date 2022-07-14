import React, { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { overrideTheme } from 'theme'
import { EntityMetadata } from '@vocdoni/data-models'
import { useProcessWrapper } from "@hooks/use-process-wrapper"

import { useEntity } from '@vocdoni/react-hooks'


import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useAuthForm } from '@hooks/use-auth-form'
import { useTheme } from '@hooks/use-theme'

import { Loader } from '@components/blocks/loader'
import { IndexerForm } from '@components/pages/pub/votes/auth/indexer-form'
import { VotingErrorPage } from '@components/pages/pub/votes/voting-error-page'
import { LayoutVoter } from '@components/pages/app/layout-v2/voter'
import { MetadataFields } from '@components/pages/votes/new/metadata'
import { useVoting } from '@hooks/use-voting'

import { useRouter } from 'next/router'
import { PREREGISTER_PATH, VOTING_PATH } from '@const/routes'
import { VotingType } from '@lib/types'
import { useCSPForm } from '@hooks/use-csp-form'
// NOTE: This page uses a custom Layout. See below.

const VoteAuthLogin = () => {
  const { i18n } = useTranslation()
  const [checkingCredentials, setCheckingCredentials] = useState<boolean>(false)
  const {
    emptyFields,
    fieldNames,
    formValues,
    processId,
    loading,
    loadingError,
    invalidCredentials,
    onLogin,
    setFormValue,
  } = useCSPForm()
  const { methods: votingMethods } = useVoting(processId)
  const { loadingInfo,loadingInfoError, processInfo } = useProcessWrapper(processId)
  const { metadata, loading : loadingEntity, error: loadingEntityError } = useEntity(processInfo?.state?.entityId)
  // const { updateAppTheme } = useTheme();

  // const entityMetadata = metadata as EntityMetadata

  useEffect(() => {
    votingMethods.cleanup()
  }, [])

  const handleSubmit = async () => {
    setCheckingCredentials(true)

    onLogin()
      .finally(() => {
        setCheckingCredentials(false)
      })
      .catch((err) => console.error('login failed', err))
  }

  // const renderLoadingPage = new ViewStrategy(
  //   () => loadingInfo || loadingEntity,
  //   <Loader visible />
  // )

  // const renderVotingInvalidLink = new ViewStrategy(
  //   () => (!loading && !loadingInfo && !loadingEntity) && invalidProcessId,
  //   (
  //     <VotingErrorPage
  //       message={i18n.t(
  //         'vote.this_type_of_vote_is_not_supported_on_the_current_page'
  //       )}
  //     />
  //   )
  // )

  const renderLoadingErrorPage = new ViewStrategy(
    () => !!loadingError || !!loadingEntityError || !!loadingInfoError,
    <VotingErrorPage message={loadingError} />
  )

  // const renderVoteNotSupported = new ViewStrategy(
  //   () => (!loading && !loadingInfo && !loadingEntity) && (!fieldNames || !fieldNames?.length),
  //   (
  //     <VotingErrorPage
  //       message={i18n.t(
  //         'vote.this_type_of_vote_is_not_supported_on_the_current_page'
  //       )}
  //     />
  //   )
  // )

  const renderForm = new ViewStrategy(
    () => true,
    (
      <div>
        <Loader visible={true} timeout={500} />
        <IndexerForm
          landing={true}
          checkingCredentials={checkingCredentials}
          fields={fieldNames}
          values={formValues}
          entity={metadata}
          onChange={setFormValue}
          onSubmit={handleSubmit}
          submitEnabled={!emptyFields}
          invalidCredentials={invalidCredentials}
        />
      </div>
    )
  )

  const viewContext = new ViewContext([
    // renderLoadingPage,
    renderLoadingErrorPage,
    // renderVotingInvalidLink,
    // renderVoteNotSupported,
    renderForm,
  ])

  return viewContext.getView()
}

// Defining the custom layout to use
VoteAuthLogin["Layout"] = LayoutVoter

export default VoteAuthLogin

