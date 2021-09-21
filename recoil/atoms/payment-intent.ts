import { atom } from 'recoil'
import { PaymentIntent } from '@stripe/stripe-js'

export const paymentIntentState = atom<PaymentIntent>({
  key: 'paymentIntentState',
  default: null
})
