import React from 'react'
import { useRecoilValueLoadable, useRecoilValue } from 'recoil'

import { Loader } from '@components/blocks/loader'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Subscription } from '@models/Subscription'

import { entityRegistryState, IEntityRegistryState } from '@recoil/atoms/entity-registry'
import { subscriptionSelector } from '@recoil/selectors/subscription'
import { walletState } from '@recoil/atoms/wallet'

import { SubscriptionView } from '@components/pages/entity/subscription'
import { Redirect } from '@components/redirect'

import { ENTITY_SIGN_IN_PATH } from '@const/routes'

const SubscriptionPage = () => {
  const wallet = useRecoilValue(walletState)
  const { contents: entityRegistryData } = useRecoilValueLoadable<IEntityRegistryState>(entityRegistryState)
  const { contents: entitySubscriptionData, state: entitySubscriptionState } = useRecoilValueLoadable<Subscription>(subscriptionSelector(entityRegistryData.subscriptionId))

  const redirectView = new ViewStrategy(
    () => !wallet,
    <Redirect to={ENTITY_SIGN_IN_PATH} />
  )
  const loadingView = new ViewStrategy(
    () => true,
    <Loader visible={true} />
  )

  const subscriptionView = new ViewStrategy(
    () => entitySubscriptionState === 'hasValue',
    <SubscriptionView subscription={entitySubscriptionData} />
  )

  const viewContext = new ViewContext([
    redirectView,
    subscriptionView,
    loadingView,
  ])

  return viewContext.getView()
}

export default SubscriptionPage