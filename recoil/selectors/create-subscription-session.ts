import { selectorFamily } from 'recoil'
import { MockSubscriptionSessionData } from '@recoil/mocks/subscription-session'

interface ICreateSubscriptionSessionData {
  subscriptionId: string
}

export interface StripeSubscriptionSession {
  url: string
  return_url: string
}

export const createNewSubscriptionSessionSelector = selectorFamily<
  StripeSubscriptionSession,
  Readonly<ICreateSubscriptionSessionData>
>({
  key: 'createNewSubscriptionSessionSelector',
  get:
    ({ subscriptionId }) =>
    async () => {
      console.log('Create subscription session with:', subscriptionId)

      return MockSubscriptionSessionData
    },
})
