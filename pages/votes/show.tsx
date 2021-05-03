import React from 'react'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Loader } from '@components/loader'
import { ViewDetail } from '@components/dashboard/vote-detail'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from 'use-url-hash'


const VoteDetailPage = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const {
    processInfo,
    results,
  } = useProcessWrapper(processId)
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
