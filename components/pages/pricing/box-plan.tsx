import React from 'react'

import { Button } from '@components/elements/button'
import { Card } from '@components/elements/cards'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'

interface IBoxPlanProps {
  title: string
  price: string
  features: string[],
  description: string
  buttonText: string
  buttonLink: string
  buttonPositive: boolean
}

export const BoxPlan = ({
  title,
  price,
  description,
  features,
  buttonText,
  buttonLink,
  buttonPositive,
}: IBoxPlanProps) => {
  return (
    <Card>
      <FlexContainer alignItem={FlexAlignItem.Center}>
        <Typography variant={TypographyVariant.H3}>{title}</Typography>
        <Typography variant={TypographyVariant.Body1}>{price}</Typography>
        <Typography variant={TypographyVariant.Body2}>{description}</Typography>
      </FlexContainer>

      <Button
        href={buttonLink}
        positive={buttonPositive}
      >
        {buttonText}
      </Button>

      <ul>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>

    </Card>
  )
}