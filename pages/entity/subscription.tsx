import React from 'react'
import { useRecoilValueLoadable } from 'recoil'

import { Loader } from '@components/blocks/loader'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Subscription } from '@models/Subscription'
import { entityRegistryState, IEntityRegistryState } from '@recoil/atoms/entity-registry'
import { subscriptionSelector } from '@recoil/selectors/subscription'

import { SubscriptionView } from '@components/pages/entity/subscription'

const SubscriptionPage = () => {
  const { contents: entityRegistryData } = useRecoilValueLoadable<IEntityRegistryState>(entityRegistryState)
  const { contents: entitySubscriptionData, state: entitySubscriptionState } = useRecoilValueLoadable<Subscription>(subscriptionSelector(entityRegistryData.subscriptionId))

  const loadingView = new ViewStrategy(
    () => true,
    <Loader visible={true} />
  )

  const subscriptionView = new ViewStrategy(
    () => entitySubscriptionState === 'hasValue',
    <SubscriptionView subscription={entitySubscriptionData} />
  )

  const viewContext = new ViewContext([
    subscriptionView,
    loadingView,
  ])

  return viewContext.getView()
}

export default SubscriptionPage