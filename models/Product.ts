import { IProductDescription } from '@const/products'
import { IStripeProduct, IStripePrice } from '@recoil/selectors/products'

type ProductQuantities = {
  label: string,
  value: number,
}

export class Price {
  public id: string
  public billingScheme: "per_unit" | "tiered"
  public unitAmount: number
  public nickname: string
  public currency: string
  public type: "recurring" | "one_time"
  public active: boolean
  public quantities: ProductQuantities[] = [
    {
      label: "0-250",
      value: 250,
    }, {
      label: "250-500",
      value: 500,
    }, {
      label: "500-1000",
      value: 1000,
    }
  ]
  public range: boolean = false

  constructor(
    price: IStripePrice,
  ) {
    this.id = price.id
    this.billingScheme = price.billing_scheme
    this.unitAmount = price.unit_amount
    this.nickname = price.nickname
    this.currency = price.currency
    this.type = price.type
    this.active = price.active
  }
}

export class Product {
  public id: string
  public title: string
  public name: string
  public description: string
  public images: string[]
  public features: string[]
  public prices: Price[]
  public freePlan: boolean

  constructor(
    stripeProduct: IStripeProduct,
    stripePrices: IStripePrice[],
    productDescription: IProductDescription,

  ) {
    if ( stripeProduct ) {
      this.id = stripeProduct.id
      this.name = stripeProduct.name
      this.images = stripeProduct.images
    }
    
    this.title = productDescription.title
    this.description = productDescription.description
    this.features = productDescription.features
    this.freePlan = productDescription.freePlan
    this.prices = stripePrices.map(price => new Price(price))
  }

  public getPrice(): Price {
    return this.prices[0]
  }
}
