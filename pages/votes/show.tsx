import React from 'react'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Loader } from '@components/loader'
import { ViewDetail } from '@components/dashboard/vote-detail'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { Redirect } from '@components/redirect'
import { ENTITY_SIGN_IN_PATH } from '@const/routes'


const VoteDetailPage = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const {
    processInfo,
    results,
    refreshProcessInfo,
  } = useProcessWrapper(processId)
  const {wallet} = useWallet({role : WalletRoles.ADMIN})

  const renderNoUserLoggedPage = new ViewStrategy(
    () => !wallet?.address,
    <Redirect to={ENTITY_SIGN_IN_PATH}></Redirect>
  )

  const loadingView = new ViewStrategy(
    () => true,
    <Loader visible></Loader>
  )

  const processDetailView = new ViewStrategy(
    () => !!processInfo && !!wallet?.address,
    <ViewDetail process={processInfo} results={results} refreshProcessInfo={refreshProcessInfo}/>
  )

  const viewContext = new ViewContext([
    renderNoUserLoggedPage,
    processDetailView,
    loadingView,
  ])

  return <>{viewContext.getView()}</>
}

export default VoteDetailPage
