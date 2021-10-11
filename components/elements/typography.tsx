import React, { ReactNode } from 'react'
import styled, { DefaultTheme, StyledComponent } from 'styled-components'
import { colors } from 'theme/colors'

export enum TypographyVariant {
  HeroBanner = 'hero-banner',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  Link = 'link',
  BannerTitle = 'banner',
  Subtitle1 = 'subtitle',
  Subtitle2 = 'subtitle2',
  Body1 = 'body1',
  Body2 = 'body2',
  Body3 = 'body3',
  ExtraSmall = 'extra-small',
  Small = 'small',
  Caption = 'Caption',
}

export enum TextAlign {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

interface ITypographyProps {
  variant?: TypographyVariant
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  href?: string
  align?: TextAlign
  margin?: string
  color?: string
  children: ReactNode
}

export const Typography = ({
  variant,
  color,
  margin,
  align,
  onClick,
  children,
}: ITypographyProps) => {
  const TypographyElement = typographyMap.get(
    variant || TypographyVariant.Body1
  )

  return (
    <TypographyElement color={color} margin={margin} align={align} onClick={onClick}>
      {children}
    </TypographyElement>
  )
}
interface ITypographyCommon {
  color?: string
  align?: TextAlign
  margin?: string
}

export const HeroBanner = styled.h1<ITypographyCommon>`
  font-size: 40px;
  font-weight: 400;
  line-height: 1em;
  margin: 6px 0;
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
`

export const H1 = styled.h1<ITypographyCommon>`
  font-size: 32px;
  font-weight: 400;
  line-height: 1em;
  margin: 6px 0;
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
`
export const H2 = styled.h2<ITypographyCommon>`
  font-size: 44px;
  font-weight: 400;
  line-height: 1em;
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
`

export const H3 = styled.h3<ITypographyCommon>`
  font-size: 26px;
  font-weight: 400;
  line-height: 1em;
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
`

export const Link = styled.a<ITypographyCommon>`
  font-size: 16px;
  font-weight: 400;
  line-height: 1em;
  text-decoration: underline;
  cursor: pointer;
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  color: ${({ color, theme }) => (color ? color : theme.blueText)};
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
`

const BaseParagraphTypography = styled.p<ITypographyCommon>`
  font-weight: 400;
  line-height: 1.2em;
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  color: ${({ color, theme }) =>
    colors[color] ? colors[color] : color ? color : theme.blueText};
  ${({ margin }) => (margin ? `margin: ${margin};` : '')}
`

export const Body1 = styled(BaseParagraphTypography)`
  font-size: 20px;
`

export const Body2 = styled(BaseParagraphTypography)`
  font-size: 18px;
`

export const Body3 = styled(BaseParagraphTypography)`
  font-size: 24px;
`

export const Subtitle1 = styled(BaseParagraphTypography)`
  font-size: 26px;
`

export const ExtraSmall = styled(BaseParagraphTypography)`
  font-size: 12px;
`

export const Small = styled(BaseParagraphTypography)`
  font-size: 16px;
`

const typographyMap = new Map<
  TypographyVariant,
  StyledComponent<'h1' | 'p', DefaultTheme, ITypographyCommon>
>([
  [TypographyVariant.HeroBanner, HeroBanner],
  [TypographyVariant.H1, H1],
  [TypographyVariant.H2, H2],
  [TypographyVariant.Subtitle1, Subtitle1],
  [TypographyVariant.H3, H3],
  [TypographyVariant.Link, Link],
  [TypographyVariant.Body1, Body1],
  [TypographyVariant.Body2, Body2],
  [TypographyVariant.Body3, Body3],
  [TypographyVariant.Small, Small],
  [TypographyVariant.ExtraSmall, ExtraSmall],
])
