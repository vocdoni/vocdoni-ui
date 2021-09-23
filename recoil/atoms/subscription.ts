import { atom } from 'recoil';
import { Subscription } from '@models/Subscription'


export const subscriptionState = atom<Subscription>({
  key: 'subscriptionState',
  default: undefined
});