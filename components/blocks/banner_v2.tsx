import React, { ReactNode } from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { FlexAlignItem, FlexContainer } from '@components/elements/flex'

interface IBannerPros {
  children: ReactNode
  icon?: ReactNode
  variant?: BannerVariant
}

export enum BannerVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export const Banner = ({ icon, variant, children }: IBannerPros) => {
  return (
    <BannerContainer variant={variant}>
      <FlexContainer alignItem={FlexAlignItem.Center}>
        {icon && <IconContainer>{icon}</IconContainer>}
        <BannerContent>{children}</BannerContent>
      </FlexContainer>
    </BannerContainer>
  )
}

const getBackgroundColor = ({ theme, variant }) => {
  switch (variant) {
    case BannerVariant.Primary:
      return `linear-gradient(110.89deg, ${theme.accentLight1B} 0%, ${theme.accentLight1} 100%)`

    case BannerVariant.Secondary:
      return `linear-gradient(110.89deg, ${theme.accentLight2} 0%, ${theme.accentLight2B} 100%)`

    default:
      return theme.white
  }
}

const BannerContainer = styled.div<{ variant: BannerVariant }>`
  background: ${getBackgroundColor};
  border-radius: 16px;
  padding: 40px;

  @media ${({ theme }) => theme.screenMax.laptop} {
    padding: 20px;
  }
`

const IconContainer = styled.div<{ variant?: BannerVariant }>`
  max-width: 66px;
  width: 100%;
  margin-right: 20px;
  
  & > img {
    max-width: 100%;
  }
`

const BannerContent = styled.div`
  width: 100%;
`
