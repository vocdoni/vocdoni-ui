import { atom } from 'recoil';
import { subscriptionSelector } from '@recoil/selectors/subscription';

export type Subscription = {
  subscriptionId: string;
  clientSecret: string;
  amount: number;
}

export const subscriptionState = atom<Subscription>({
  key: 'subscriptionState',
  default: undefined
});