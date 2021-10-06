import { IStripeTier } from '@recoil/selectors/products'

export class Tier {
  public flatAmount: number
  public uintAmount: number
  public upTo: number
  public fromTo: number
  public lastTier: boolean

  constructor(){}

  static tierFromStripe(stripeProduct: IStripeTier): Tier {
    const tier = new Tier()

    tier.flatAmount = stripeProduct.flat_amount
    tier.uintAmount = stripeProduct.unit_amount
    tier.upTo = stripeProduct.up_to
    
    return tier
  }
}