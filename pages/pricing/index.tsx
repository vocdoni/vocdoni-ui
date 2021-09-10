import React from "react"

import { Table, TableHeader, TableRow, TableCell, Text } from '@aragon/ui'
import { Typography, TypographyVariant } from "@components/elements/typography"
import { useTranslation } from "react-i18next"
import { Column, Grid } from "@components/elements/grid"
import { BoxPlan } from "@components/pages/pricing/box-plan"
import RouterService from "@lib/router"
import { PAYMENT_PAGE } from "@const/routes"

interface IPricingPlan {
  title: string
  price: string
  description: string
  buttonText: string
  license: string
  buttonLink: string,
  buttonPositive: boolean,
  features: string[]
}

const PricingPage = () => {
  const { i18n } = useTranslation()

  const pricingPlans: IPricingPlan[] = [
    {
      title: i18n.t('pricing.plans.basic.title'),
      price: i18n.t('pricing.plans.basic.price'),
      description: i18n.t('pricing.plans.basic.description'),
      license: "basic",
      buttonText: i18n.t('pricing.plans.basic.button'),
      buttonLink: RouterService.instance.get(PAYMENT_PAGE, {license: 'basic'}),
      buttonPositive: false,
      features: [
        "1-to-1 support",
        "1-to-1 support",
        "1-to-1 support",
        "1-to-1 support",
        "1-to-1 support",
      ]
    },
    {
      title: i18n.t('pricing.plans.standard.title'),
      price: i18n.t('pricing.plans.standard.price'),
      description: i18n.t('pricing.plans.standard.description'),
      license: "standard",
      buttonText: i18n.t('pricing.plans.standard.button'),
      buttonLink: RouterService.instance.get(PAYMENT_PAGE, {license: 'standard'}),
      buttonPositive: true,
      features: [
        "1-to-1 support",
        "1-to-1 support",
        "1-to-1 support",
        "1-to-1 support",
        "1-to-1 support",
      ]
    },
  ]
  return <div>
    <Typography variant={TypographyVariant.H1}>{"pricing.title"}}</Typography>

    <Grid>
      { pricingPlans.map(plan => (
        <Column md={6} sm={12}>
          <BoxPlan {...plan}/>
        </Column>
      )}
    </Grid>
  </div>
}

export default PricingPage