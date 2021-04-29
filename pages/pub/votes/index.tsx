import React from 'react'

import { useVoting } from '@hooks/use-voting'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Loader } from '@components/loader'
import { VotingPageView } from '@components/pub/votes'

const VotingPage = () => {
  const { processInfo } = useVoting()

  const renderVotePage = new ViewStrategy(
    () => !!processInfo,
    <>
      <VotingPageView />
    </>
  )

  const renderLoaderPage = new ViewStrategy(
    () => true,
    <Loader visible />
  )
  
  const contextView = new ViewContext([
    renderVotePage,
    renderLoaderPage
  ])

  return (contextView.getView())
}

export default VotingPage
