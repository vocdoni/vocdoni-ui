import { selectorFamily } from 'recoil'
import { Subscription } from '@models/Subscription'
import { MockSubscriptionData } from '@recoil/mocks/subscription'

interface ICreateSubscriptionData {
  priceId: string
  quantity: number
}

export const createNewSubscriptionSelector = selectorFamily<Subscription, Readonly<ICreateSubscriptionData>>({
  key: 'createNewSubscriptionSelector',
  get:
    ({ priceId, quantity }) =>
    async ({ get }) => {
      console.log('Create subscription with:', priceId, quantity)

      const subscription = Subscription.fromStripeData(MockSubscriptionData)

      return subscription
    },
})
