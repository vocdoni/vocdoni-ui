import React from 'react'

import { ViewContext, ViewStrategy } from '@lib/strategy'
import { useEntity } from '@vocdoni/react-hooks'

import { Loader } from '@components/blocks/loader'
import { ViewDetail } from '@components/pages/dashboard/vote-detail'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useUrlHash } from 'use-url-hash'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { Redirect } from '@components/redirect'
import { ENTITY_SIGN_IN_PATH } from '@const/routes'
import { useScrollTop } from '@hooks/use-scroll-top'
import { LayoutEntity } from '@components/pages/app/layout-v2/entity'

// NOTE: This page uses a custom Layout. See below.

const VoteDetailPage = () => {
  useScrollTop()
  const processId = useUrlHash().slice(1) // Skip "/"
  const {
    processInfo,
  } = useProcessWrapper(processId)
  const { wallet } = useWallet({ role: WalletRoles.ADMIN })
  const { metadata: entityMetadata } = useEntity(wallet?.address)


  const redirectNoWallet = new ViewStrategy(
    () => !wallet?.address,
    <Redirect to={ENTITY_SIGN_IN_PATH}></Redirect>
  )

  const processDetailView = new ViewStrategy(
    () => !!processInfo && !!wallet?.address && !!entityMetadata,
    <ViewDetail />
  )

  const loadingView = new ViewStrategy(
    () => true,
    <Loader visible></Loader>
  )

  const viewContext = new ViewContext([
    redirectNoWallet,
    processDetailView,
    loadingView,
  ])

  return <>{viewContext.getView()}</>
}

// Defining the custom layout to use
VoteDetailPage["Layout"] = LayoutEntity

export default VoteDetailPage
