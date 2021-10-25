import React from "react"
import styled from "styled-components"

import { Card } from "@components/elements/cards"
import { Typography, TypographyVariant, TextAlign } from "@components/elements/typography"
import { Product } from "@models/Product"
import { Subscription } from "@models/Subscription"

interface IPaymentBoxProps {
  product: Product
  subscription: Subscription,
}

export const PaymentBox = ({product, subscription}: IPaymentBoxProps) => {
  return (
    <Card>
      <div>
        <Typography align={TextAlign.Center} variant={TypographyVariant.H3}>{product.title}</Typography>
        <Typography align={TextAlign.Center} variant={TypographyVariant.Body1}>{(subscription.amount / 100).toFixed(2)}€</Typography>
        <Typography align={TextAlign.Center} variant={TypographyVariant.Body2}>{product.description}</Typography>
      </div>

      <FeatureList>
        {product.features && product.features.map((feature, index) => (
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