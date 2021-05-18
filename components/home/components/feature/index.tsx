import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { colors } from 'theme/colors'

interface IFeatureSectionProps {
  image: ReactElement,
  title: string,
  subtitle: string
} 

export const FeatureSection = ({image, title, subtitle}: IFeatureSectionProps) => (
  <FeatureContainer>
    <ImageContainer>{image}</ImageContainer>
    <Typography variant={TypographyVariant.Body1}>{title}</Typography>
    <Typography variant={TypographyVariant.Small} color={colors.lightText}>{subtitle}</Typography>
  </FeatureContainer>
)

const FeatureContainer = styled.div`
  padding: 6px 12px
`
const ImageContainer = styled.div``
