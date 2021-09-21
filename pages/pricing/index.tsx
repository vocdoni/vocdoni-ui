import React, { useState, useEffect } from "react"
import { useRecoilValueLoadable, useRecoilValue } from "recoil"


import { Product } from "models/Product"
import { ViewContext, ViewStrategy } from "@lib/strategy"

import { Loader } from "@components/blocks/loader"
import { PricingView } from "@components/pages/pricing"
import { Redirect } from "@components/redirect"

import { productsState } from "@recoil/atoms/products"
import { walletState } from "@recoil/atoms/wallet"

import { ENTITY_SIGN_IN_PATH } from '@const/routes';

const PricingPage = () => {
  const [redirectUrl, setRedirectUrl] = useState(null)
  const {contents: products, state: productsStatus} = useRecoilValueLoadable<Product[]>(productsState)
  const wallet = useRecoilValue(walletState)
  console.log('el wallet es', wallet)
  useEffect(() => {
    if(!wallet) {
      setRedirectUrl(ENTITY_SIGN_IN_PATH)
    }
  }, [wallet])

  const redirectView = new ViewStrategy(
    () => redirectUrl,
    <>
      <Loader visible />
      <Redirect to={redirectUrl}/>
    </>
  )


  const pricingView = new ViewStrategy(
    () => productsStatus === 'hasValue',
    <PricingView products={products} />
  )

  const loaderView = new ViewStrategy(
    () => true,
    <Loader visible />
  )
  
  const viewContext = new ViewContext([
    redirectView,
    pricingView,
    loaderView
  ])
  return (
    viewContext.getView()
  )
}

export default PricingPage