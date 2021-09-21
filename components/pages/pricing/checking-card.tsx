import React from 'react';
import styled from 'styled-components'
import { Button } from '@components/elements/button';
import { Card } from '@components/elements/cards';
import { Price, Product } from '@models/Product';
import RouterService from '@lib/router';
import { PAYMENT_PAGE } from '@const/routes';
import { useTranslation } from 'react-i18next';

interface ICheckingCardProps {
  product: Product
}

export const CheckingCard = ({ product }: ICheckingCardProps) => {
  const { i18n } = useTranslation()
  console.log('CheckingCard', product);
  const price = product.getPrice()

  return (
    <Card>
      <h2>{product.name}</h2>
      <p>{product.description}</p>

      <ButtonContainer>

        {price.quantities.map((quantity, index) => (
          <Button
            key={index}
            positive
            href={RouterService.instance.get(PAYMENT_PAGE, { productId: product.id, priceId: price.id, quantity: quantity.value.toFixed() })}
          >{`${i18n.t('pricing.checking_card.volume')}: ${quantity.label}`}</Button>
        ))
        }
      </ButtonContainer>
    </Card>
  )
}

const ButtonContainer = styled.div`
  display: inline-block;

  button {
    margin-right: 10px;
  }
  `