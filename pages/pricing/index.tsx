import React, { useState, useRef } from 'react'
import { useRecoilValueLoadable, useRecoilValue } from 'recoil'

import { Product } from 'models/Product'
import { ViewContext, ViewStrategy } from '@lib/strategy'

import { Loader } from '@components/blocks/loader'
import { PricingView } from '@components/pages/pricing'
import { SignInModal } from '@components/pages/pricing/sign-in-modal'

import { Redirect } from '@components/redirect'

import { productsState } from '@recoil/atoms/products'
import { walletState } from '@recoil/atoms/wallet'

import { CREATE_ACCOUNT_PATH, PAYMENT_PAGE } from '@const/routes'
import RouterService from '@lib/router'

const PricingPage = () => {
  const [redirectUrl, setRedirectUrl] = useState(null)
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false)
  const { contents: products, state: productsStatus } = useRecoilValueLoadable<Product[]>(productsState)
  const wallet = useRecoilValue(walletState)

  const selectedProductId = useRef<string>(null)
  const selectedPriceId = useRef<string>(null)
  const selectedQuantity = useRef<number>(null)

  const handleCheckout = (product: Product, voters: number) => {
    if (wallet) {
      setRedirectUrl(
        RouterService.instance.get(PAYMENT_PAGE, {
          productId: product.id,
          priceId: product.price.id,
          quantity: voters.toString(),
        })
      )
    } else {
      selectedProductId.current = product.id
      selectedPriceId.current = product.price.id
      selectedQuantity.current = voters

      setShowSignInModal(true)
    }
  }

  const handleLogIn = () => {
    setRedirectUrl(
      RouterService.instance.get(PAYMENT_PAGE, {
        productId: selectedProductId.current,
        priceId: selectedPriceId.current,
        quantity: selectedQuantity.current.toString(),
      })
    )
  }
  const handleSingUp = () => {
    setRedirectUrl(
      RouterService.instance.get(CREATE_ACCOUNT_PATH, {
        "callback_url": encodeURIComponent(
          RouterService.instance.get(PAYMENT_PAGE, {
            productId: selectedProductId.current,
            priceId: selectedPriceId.current,
            quantity: selectedQuantity.current.toString(),
          })
        ),
      })
    )
  }

  const redirectView = new ViewStrategy(
    () => redirectUrl,
    (
      <>
        <Loader visible />
        <Redirect to={redirectUrl} />
      </>
    )
  )

  const pricingView = new ViewStrategy(
    () => productsStatus === 'hasValue',
    (
      <>
        <PricingView products={products} onCheckout={handleCheckout} />
        <SignInModal
          isOpen={showSignInModal}
          onLogIn={handleLogIn}
          onClose={() => setShowSignInModal(false)}
          onSignUp={handleSingUp}
        />
      </>
    )
  )

  const loaderView = new ViewStrategy(() => true, <Loader visible />)

  const viewContext = new ViewContext([redirectView, pricingView, loaderView])
  return viewContext.getView()
}

export default PricingPage
