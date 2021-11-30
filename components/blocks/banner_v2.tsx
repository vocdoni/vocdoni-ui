import React, { ReactNode } from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { FlexAlignItem, FlexContainer } from '@components/elements/flex'

interface IBannerPros {
  children: ReactNode
  icon?: ReactNode
  variant?: BannerVariant
  size?: BannerSize
}

export enum BannerVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum BannerSize {
  Normal = 'normal',
  Small = 'small',
}

export const Banner = ({ icon, variant, size, children }: IBannerPros) => {
  return (
    <BannerContainer variant={variant} size={size || BannerSize.Normal}>
      <FlexContainer alignItem={FlexAlignItem.Center}>
        {icon && <IconContainer size={size || BannerSize.Normal}>{icon}</IconContainer>}
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
      return `linear-gradient(110.89deg, ${theme.accentLight2B} 0%, ${theme.accentLight2} 100%)`

    default:
      return theme.white
  }
}

const getBannerPaddingSize = ({ size }) => {
  switch (size) {
    case BannerSize.Small:
      return '32px'

    default:
      return '40px'
  }
}


const getBannerIconSize = ({ size }) => {
  switch (size) {
    case BannerSize.Small:
      return '30px'

    default:
      return '60px'
  }
}

const BannerContainer = styled.div<{ variant: BannerVariant, size: BannerSize }>`
  background: ${getBackgroundColor};
  border-radius: 16px;
  padding: ${getBannerPaddingSize};

  @media ${({ theme }) => theme.screenMax.laptop} {
    padding: 20px;
  }
`

const IconContainer = styled.div<{ size: BannerSize }>`
  max-width: ${getBannerIconSize};
  width: 100%;
  margin-right: 20px;
  
  & > img {
    max-width: 100%;
  }
`

const BannerContent = styled.div`
  width: 100%;
`
