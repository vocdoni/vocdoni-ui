import { selector } from 'recoil'

import { vocdoniProducts } from '@const/products'
import { STRIPE_PLANS_KEY } from '@const/env'
import { GET_PRODUCTS_URL, GET_PRICES_URL } from '@const/stripe'
import { Product } from 'models/Product'

export interface IStripeProduct {
  "id": string,
  "object": "product",
  "active": boolean,
  "created": number,
  "description": string,
  "images": string[],
  "livemode": boolean,
  "metadata": any,
  "name": string,
  "package_dimensions": string,
  "shippable": string,
  "statement_descriptor": string,
  "tax_code": string,
  "unit_label": string,
  "updated": number,
  "url": string
}

interface IStripeResponseJSON {
  data: IStripeProduct[]
}

export interface IStripePrice {
  "id": string,
  "object": "price",
  "active": boolean,
  "billing_scheme": "per_unit" | "tiered",
  "created": number,
  "currency": "eur" | "usd",
  "livemode": boolean,
  "lookup_key": string,
  "metadata": any,
  "nickname": string,
  "product": string,
  "recurring": {
    "aggregate_usage": number,
    "interval": "year" | "month" | "week" | "day",
    "interval_count": number,
    "usage_type": "licensed" | "metered"
  },
  "tax_behavior": "unspecified",
  "tiers_mode": null,
  "transform_quantity": null,
  "type": "recurring" | "one_time",
  "unit_amount": number,
  "unit_amount_decimal": string
}

interface IStripePriceJSON {
  data: IStripePrice[]
}

export const productsSelector = selector<Product[]>({
  key: 'productsSelector',
  get: async () => {
    try {
      const productsResponse = await fetch(GET_PRODUCTS_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRIPE_PLANS_KEY}`
        }
      })
      const { data: jsonProductsResponse }: IStripeResponseJSON = await productsResponse.json()

      const pricesResponse = await fetch(GET_PRICES_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${STRIPE_PLANS_KEY}`
        }
      })

      const { data: jsonPricesResponse }: IStripePriceJSON = await pricesResponse.json()
      const parsedProducts = vocdoniProducts.map((vocdoniProduct) => {
        const stripeProduct = jsonProductsResponse.find(
          (stripeProduct) => vocdoniProduct.id === stripeProduct.id
        )
        const stripeProductPrices = jsonPricesResponse.filter(
          (stripeProductPrices) => stripeProduct && stripeProduct.id === stripeProductPrices.product
        )

        return new Product(
          stripeProduct,
          stripeProductPrices,
          vocdoniProduct
        )
      })

      return parsedProducts
    } catch (error) {
      console.log('el error es ', error)
    }
    return []
  }
})
