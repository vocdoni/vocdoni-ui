import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Button } from '@components/elements/button'
import { Card } from '@components/elements/cards'
import { Price, Product } from '@models/Product'
import { Grid } from '@components/elements/grid'

import RouterService from '@lib/router'
import { PAYMENT_PAGE } from '@const/routes'

interface ICheckingCardProps {
  product: Product
}

export const CheckingCard = ({ product }: ICheckingCardProps) => {
  const { i18n } = useTranslation()
  const price = product.getPrice()

  return (
    <Grid>
      <Card>
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <ButtonContainer>
          {price.tiers.map((tier, index) => (
            <Button
              key={index}
              positive
              href={RouterService.instance.get(PAYMENT_PAGE, {
                productId: product.id,
                priceId: price.id,
                quantity: tier.upTo ? tier.upTo.toFixed() : '1000',
              })}>{`${i18n.t('pricing.checking_card.volume')}: ${tier.upTo}`}</Button>
          ))}
        </ButtonContainer>
      </Card>
    </Grid>
  )
}

const ButtonContainer = styled.div`
  display: inline-block;

  button {
    margin-right: 10px;
  }
`
