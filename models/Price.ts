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

  get payingTiers(): Tier[] {
    return this.tiers ? this.tiers.slice(1) : []
  }

  static priceFromStripe(stripePrice: IStripePrice): Price {
    const price = new Price()

    price.id = stripePrice.id
    price.billingScheme = stripePrice.billing_scheme
    price.unitAmount = stripePrice.unit_amount
    price.nickname = stripePrice.nickname
    price.currency = stripePrice.currency
    price.type = stripePrice.type
    price.active = stripePrice.active

    const orderedTiers = stripePrice.tiers.sort((a, b) => (a.up_to ? a.up_to - b.up_to : 1))
    price.tiers = []

    for (let stripeTier of orderedTiers) {
      const tier = Tier.tierFromStripe(stripeTier)
      const [prevTier] = price.tiers.slice(-1)

      if (!prevTier) {
        tier.fromTo = 0
      } else {
        tier.fromTo = prevTier.upTo
      }

      if (!stripeTier.up_to) {
        tier.fromTo = prevTier.upTo * 2
        tier.upTo = prevTier.upTo * 4

        tier.lastTier = true
      }

      price.tiers.push(tier)
    }

    return price
  }
}
