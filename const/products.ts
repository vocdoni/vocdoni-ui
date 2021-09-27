import i18n from '@i18n';

import { STRIPE_ORGANIZATION_PRODUCT_ID, STRIPE_COMMUNITY_PRODUCT_ID } from '@const/stripe';

export interface IProductDescription {
  id?: string
  title: string
  description: string
  productType: string
  name: string
  freePlan: boolean
  features: string[]
}

  
export const vocdoniProducts: IProductDescription[] = [
  {
    title: i18n.t('products.plans.basic.title'),
    description: i18n.t('products.plans.basic.description'),
    name: "test",
    productType: "basic",
    freePlan: true,
    features: [
      "1-to-1 support",
      "1-to-1 support",
      "1-to-1 support",
      "1-to-1 support",
      "1-to-1 support",
    ]
  },
  {
    id: STRIPE_COMMUNITY_PRODUCT_ID,
    title: i18n.t('products.plans.community.title'),
    description: i18n.t('products.plans.community.description'),
    name: "Vocdoni Premium",
    productType: "community",
    freePlan: false,
    features: [
      "1-to-2 support",
      "1-to-2 support",
      "1-to-2 support",
      "1-to-2 support",
      "1-to-2 support",
    ]
  },
  {
    id: STRIPE_ORGANIZATION_PRODUCT_ID,
    title: i18n.t('products.plans.organization.title'),
    description: i18n.t('products.plans.organization.description'),
    name: "Vocdoni Premium",
    productType: "organization",
    freePlan: false,
    features: [
      "1-to-2 support",
      "1-to-2 support",
      "1-to-2 support",
      "1-to-2 support",
      "1-to-2 support",
    ]
  },
]