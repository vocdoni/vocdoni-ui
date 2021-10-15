import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useRecoilValueLoadable, useRecoilState } from 'recoil'
import { PaymentIntent } from '@stripe/stripe-js'

import { Product } from '@models/Product'
import { Subscription } from '@models/Subscription'

import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Loader } from '@components/blocks/loader'
import { PaymentView } from '@components/pages/payment'
import { Redirect } from '@components/redirect'

import { createNewSubscriptionSelector } from '@recoil/selectors/create-subscription'
import { productSelector } from '@recoil/selectors/product'
import { paymentIntentState } from '@recoil/atoms/payment-intent'
import { walletState } from '@recoil/atoms/wallet'

import { ENTITY_SIGN_IN_PATH, PAYMENT_SUCCESS_PAGE } from '@const/routes'

export default function PaymentPage() {
  const { query } = useRouter()
  const [redirectUrl, setRedirectUrl] = useState(null)

  const productId = query.product_id as string
  const priceId = query.price_id as string
  const quantity = parseInt(query.quantity as string)

  const wallet = useRecoilState(walletState)
  const { contents: product, state: productState } = useRecoilValueLoadable<Product>(productSelector(productId))
  const { contents: subscription, state: subscriptionState } = useRecoilValueLoadable<Subscription>(
    createNewSubscriptionSelector({ priceId, quantity })
  )
  const [paymentIntent, setPaymentIntent] = useRecoilState(paymentIntentState)

  const handlePaymentSubmit = async (intent: PaymentIntent) => {
    setPaymentIntent(intent)
    setRedirectUrl(PAYMENT_SUCCESS_PAGE)
  }

  useEffect(() => {
    if (!wallet) {
      setRedirectUrl(ENTITY_SIGN_IN_PATH)
    }
  }, [wallet])

  const redirectView = new ViewStrategy(() => redirectUrl, <Redirect to={redirectUrl} />)

  const paymentView = new ViewStrategy(
    () => productState === 'hasValue' && subscriptionState === 'hasValue' && product && product.features,
    (
      <PaymentView
        product={product}
        quantity={quantity}
        onPaymentSubmit={handlePaymentSubmit}
        subscription={subscription}
      />
    )
  )

  const loadingView = new ViewStrategy(() => true, <Loader visible />)

  const viewContext = new ViewContext([redirectView, paymentView, loadingView])

  return viewContext.getView()
}
