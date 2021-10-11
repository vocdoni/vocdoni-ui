import { IProductFeatures } from '@const/products'
import { IStripeProduct, IStripePrice } from '@recoil/selectors/products'

import { Price } from '@models/Price'
import { Tier } from '@models/Tier'

export class Product {
  public id: string
  public title: string
  public name: string
  public description: string
  public images: string[]
  // public features: string[]
  public prices: Price[]
  public votingPerYear: number
  public pricePerVoter: number
  public freePlan: boolean
  public features: IProductFeatures
  public maxVoters: number = 10000

  constructor() {}

  get priceEuro(): string {
    return this.lastTier ? (this.lastTier.flatAmount / 100).toFixed(2) : '0'
  }

  get pricePerVoterEuro(): string {
    return this.lastTier ? (this.lastTier.uintAmount / 100).toFixed(2) : '0'
  }

  get lastTier(): Tier {
    return this.prices[0].tiers ? this.prices[0].tiers.find((tier) => tier.lastTier) : undefined
  }

  get price(): Price {
    return this.prices[0]
  }

  getExtraVotersPrice(quantity: number): number {
    let totalCost = 0
    let remainingQuantity = quantity

    for (let tier of this.price.tiers) {
      if (remainingQuantity > tier.upTo) {
        totalCost += tier.upTo * tier.uintAmount
        remainingQuantity -= tier.upTo
      } else {
        totalCost += tier.uintAmount * remainingQuantity
        break
      }
    }

    return totalCost
  }

  static productFromStripe(
    stripeProduct: IStripeProduct,
    stripePrices: IStripePrice[],
    features: IProductFeatures
  ): Product {
    const product = new Product()

    if (stripeProduct) {
      product.id = stripeProduct.id
      product.name = stripeProduct.name
      product.images = stripeProduct.images
    }

    product.title = features.title
    product.description = features.description
    product.votingPerYear = features.votingPerYear
    product.features = features
    product.freePlan = features.freePlan
    product.prices = stripePrices.map((price) => Price.priceFromStripe(price))

    return product
  }
}
