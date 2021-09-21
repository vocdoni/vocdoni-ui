import i18n from '@i18n';

export interface IProductDescription {
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