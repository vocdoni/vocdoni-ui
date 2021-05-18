import React, { ReactNode } from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'

export enum TypographyVariant {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  BannerTitle = 'banner',
  Subtitle1 = 'subtitle',
  Subtitle2 = 'subtitle2',
  Body1 = 'body1',
  Body2 = 'body2',
  Small = 'small',
  Caption = 'Caption',
}

export enum TextAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center'
}

interface ITypographyProps {
  variant?: TypographyVariant
  align?: TextAlign
  margin?: string
  color?: string
  children: ReactNode
}

export const Typography = ({ variant, color, margin, align, children }: ITypographyProps) => {
  const TypographyElement = typographyMap.get(
    variant || TypographyVariant.Body1
  )

  return <TypographyElement color={color} margin={margin} align={align}>{children}</TypographyElement>
}
interface ITypographyCommon {
  color?: string
  align?: TextAlign
  margin?: string
}

export const H1 = styled.h1<ITypographyCommon>`
  font-size: 40px;
  font-weight: 400;
  line-height: 1em;
  margin: 6px 0;
  text-align: ${({align}) => align? align: TextAlign.Left};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({margin}) => margin? `margin: ${margin};`: ''}
`
export const H2 = styled.h2<ITypographyCommon>`
  font-size: 44px;
  font-weight: 400;
  line-height: 1em;
  text-align: ${({align}) => align? align: TextAlign.Left};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({margin}) => margin? `margin: ${margin};`: ''}
`

export const Body1 = styled.p<ITypographyCommon>`
  font-size: 20px;
  font-weight: 400;
  line-height: 1.2em;
  text-align: ${({align}) => align? align: TextAlign.Left};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({margin}) => margin? `margin: ${margin};`: ''}
`

export const Body2 = styled.p<ITypographyCommon>`
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2em;
  text-align: ${({align}) => align? align: TextAlign.Left};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({margin}) => margin? `margin: ${margin};`: ''}
`

export const Small = styled.p<ITypographyCommon>`
  font-size: 16px;
  font-weight: 400;
  line-height: 1.2em;
  text-align: ${({align}) => align? align: TextAlign.Left};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({margin}) => margin? `margin: ${margin};`: ''}
`

const typographyMap = new Map<
  TypographyVariant,
  StyledComponent<'h1' | 'p', DefaultTheme , ITypographyCommon>
>([
  [TypographyVariant.H1, H1],
  [TypographyVariant.Body1, Body1],
  [TypographyVariant.Body2, Body2],
  [TypographyVariant.Small, Small],
])
