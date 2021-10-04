import { IStripePrice, IStripeTier } from '@recoil/selectors/products'

import { Tier } from '@models/Tier'

export class Price {
  public id: string
  public billingScheme: 'per_unit' | 'tiered'
  public unitAmount: number
  public nickname: string
  public currency: string
  public type: 'recurring' | 'one_time'
  public active: boolean
  public tiers: Tier[]
  public range: boolean = false

  constructor() {}

  static priceFromStripe(stripePrice: IStripePrice): Price {
    const price = new Price()

    price.id = stripePrice.id
    price.billingScheme = stripePrice.billing_scheme
    price.unitAmount = stripePrice.unit_amount
    price.nickname = stripePrice.nickname
    price.currency = stripePrice.currency
    price.type = stripePrice.type
    price.active = stripePrice.active

    let lastTier: IStripeTier = null

    price.tiers = stripePrice.tiers.map((stripeTier) => {
      const tier = Tier.tierFromStripe(stripeTier)
      
      if (!stripeTier.up_to) {
        console.log('El last tier', lastTier)
        tier.upTo = lastTier.up_to * 2
        tier.lastTier = true
      } else if (!lastTier || stripeTier.up_to > lastTier.up_to) {
        lastTier = stripeTier
      }

      return tier
    })

    return price
  }
}
