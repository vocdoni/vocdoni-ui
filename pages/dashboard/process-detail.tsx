import React from 'react'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Loader } from '@components/loader'
import { ViewDetail } from '@components/dashboard/vote-detail'
import { useVoting } from '@hooks/use-voting'

const VoteDetailPage = () => {
  const {
    processInfo,
    results,
  } = useVoting()
  const loadingView = new ViewStrategy(
    () => true,
    <Loader visible></Loader>
  )

  const processDetailView = new ViewStrategy(
    () => !!processInfo,
    <ViewDetail process={processInfo} results={results}/>
  )

  const viewContext = new ViewContext([
    processDetailView,
    loadingView
  ])

  return <>{viewContext.getView()}</>
}

export default VoteDetailPage
