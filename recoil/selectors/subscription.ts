import { selectorFamily } from "recoil";

type Subscription = {
  subscriptionId: string;
  clientSecret: string;
  amount: number;
}

interface ICreateSubscriptionData {
  priceId: string;
  quantity: number;
}

export const subscriptionSelector = selectorFamily<Subscription, Readonly<ICreateSubscriptionData>>({
  key: "subscriptionSelector",
  get: ({ priceId, quantity}) => async ({ get }) => {
    console.log('Create subscription with:', priceId, quantity);

    return {
      subscriptionId: 'sub_1JbpHNDiJcunaZwg2oyQPw5Y',
      clientSecret: 'pi_3JbpLhDiJcunaZwg0VDDtHh7_secret_d4urWBzAMPp5PJsDbUEWsHwJS',
      amount: 51000,
    }
  }
})