import { selectorFamily } from "recoil";
import { Subscription } from "@models/Subscription"
import { MockSubscriptionData } from "@recoil/mocks/subscription";
import { productSelector } from "./product";

export interface IStripeSubscriptionItem {
  id: string,
  price: {
    id: string,
    product: string,
  }
}

export interface IStripePaymentIntent {
  id: string,
  client_secret: string
}

export interface IStripeInvoice {
  id: string,
  amount_paid: number,
  amount_remaining: number,  
  payment_intent: IStripePaymentIntent,
}

export interface IStripeSubscription {
  "id": string,
  "cancel_at_period_end": boolean,
  "current_period_end": number,
  "current_period_start": number,
  "customer": string,
  "items": {
    data: IStripeSubscriptionItem[]
  },
  "latest_invoice": IStripeInvoice,
  "status":  "active" | "past_due" | "unpaid" | "canceled" | "incomplete" | "incomplete_expired" | "trialing" | string
}

export const subscriptionSelector = selectorFamily<Subscription, string>({
  key: "subscriptionSelector",
  get: (subscriptionId: string) => async ({get}) => {
    if (subscriptionId) {
      const subscription = Subscription.fromStripeData(MockSubscriptionData)

      return subscription
    }
  }
})