import { IProductFeatures } from '@const/products'
import { IStripeProduct, IStripePrice, IStripeTier } from '@recoil/selectors/products'

type ProductQuantities = {
  label: string,
  value: number,
}

export class Tier {
  public flatAmount: number
  public uintAmount: number
  public upTo: number

  constructor(){}

  static tierFromStripe(stripeProduct: IStripeTier): Tier {
    const tier = new Tier()

    tier.flatAmount = stripeProduct.flat_amount
    tier.uintAmount = stripeProduct.unit_amount
    tier.upTo = stripeProduct.up_to
    
    return tier
  }
}

export class Price {
  public id: string
  public billingScheme: "per_unit" | "tiered"
  public unitAmount: number
  public nickname: string
  public currency: string
  public type: "recurring" | "one_time"
  public active: boolean
  public tiers: Tier[]
  public range: boolean = false

  constructor() {}

  static priceFromStripe(
    stripePrice: IStripePrice,
  ): Price {
    const price = new Price()

    price.id = stripePrice.id
    price.billingScheme = stripePrice.billing_scheme
    price.unitAmount = stripePrice.unit_amount
    price.nickname = stripePrice.nickname
    price.currency = stripePrice.currency
    price.type = stripePrice.type
    price.active = stripePrice.active  

    price.tiers = stripePrice.tiers.map(tier => Tier.tierFromStripe(tier))

    return price
  }
}

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

  constructor() {}

  get priceEuro(): string {
    return this.lastTier ? (this.lastTier.flatAmount / 100).toFixed(2) : '0'
  }

  get pricePerVoterEuro(): string {
    return this.lastTier ? (this.lastTier.uintAmount / 100).toFixed(2) : '0'
  }


  get lastTier () {
  
    return this.prices[0].tiers? this.prices[0].tiers.find(tier => !tier.upTo): undefined
  }

  public getPrice(): Price {
    return this.prices[0]
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
    product.prices = stripePrices.map(price => Price.priceFromStripe(price))

    return product
  }
}
