import React from 'react'
import { Loader } from '@components/blocks/loader'
import { VotingPageView } from '@components/pages/pub/votes'
import { useUrlHash } from 'use-url-hash'
import { VotingErrorPage } from '@components/pages/pub/votes/voting-error-page'
import { useProcess } from '@vocdoni/react-hooks'
// import { LayoutVoter } from '@components/pages/app/layout/voter'
import { LayoutVoter } from '@components/pages/app/layout-v2/voter'
import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useProcessWrapper } from '@hooks/use-process-wrapper'


// NOTE: This page uses a custom Layout. See below.

const VotingPage = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  // const { process, error, loading } = useProcess(processId)
  const { loadingInfoError, loadingInfo, processInfo: process } = useProcessWrapper(processId)

   const renderLoadingPage = new ViewStrategy(
    () => loadingInfo ,
    <Loader visible />
  )

  const renderLoadingErrorPage = new ViewStrategy(
    () => !!loadingInfoError,
    <VotingErrorPage message={loadingInfoError} />
  )

  const renderForm = new ViewStrategy(
    () => !! process,
    <VotingPageView />
  )

  const viewContext = new ViewContext([
    renderLoadingPage,
    renderLoadingErrorPage,
    renderForm,
  ])

  return viewContext.getView()


  // if (process) return <VotingPageView />
  // else if (loadingInfoError) return <VotingErrorPage
  //   message={loadingInfoError}
  // />
  // return <Loader visible />
}

// Defining the custom layout to use
VotingPage["Layout"] = LayoutVoter

export default VotingPage
