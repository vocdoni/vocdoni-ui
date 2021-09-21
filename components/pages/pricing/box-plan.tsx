import React from 'react'
import styled from 'styled-components'

import { Button } from '@components/elements/button'
import { Card } from '@components/elements/cards'
import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'


import { PAYMENT_PAGE } from '@const/routes'
import RouterService from '@lib/router'
import { Product } from 'models/Product'
import { useTranslation } from 'react-i18next'

interface IBoxPlanProps {
  product: Product,
  onSelectProduct: (product: Product) => void,
}

export const BoxPlan = ({ product, onSelectProduct }: IBoxPlanProps) => {
  const { i18n } = useTranslation()
  return (
    <Card>
      <div>
        <Typography align={TextAlign.Center} variant={TypographyVariant.H3}>{product.title}</Typography>
        {/* <Typography align={TextAlign.Center} variant={TypographyVariant.Body1}>{product.price}</Typography> */}
        <Typography align={TextAlign.Center} variant={TypographyVariant.Body2}>{product.description}</Typography>
      </div>

      {!product.freePlan && <Button
        onClick={() => { onSelectProduct(product) }}
        // href={RouterService.instance.get(PAYMENT_PAGE, {licenseId: id || ''}) }
        positive
        wide
      >
        {i18n.t('components.pricing.choose')}
      </Button>}

      <FeatureList>
        {product.features.map((feature, index) => (
          <FeatureItem key={index}>{feature}</FeatureItem>
        ))}
      </FeatureList>
    </Card>
  )
}

const FeatureList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const FeatureItem = styled.li`
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  margin: -4px -20px;
`