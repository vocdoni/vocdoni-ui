import styled from 'styled-components'
import { colors } from '../theme/colors'
import { Colors } from '../theme/types'

// MAIN

export const MainTitle = styled.h1`
  margin-top: 0;
  margin-bottom: 10px;
`

export const MainDescription = styled.span`
  color: ${({ theme }) => theme.textAccent1};
`

export enum TextAlign {
  Center = 'center',
  Justify = 'justify',
  Left = 'left',
  Right = 'right',
}

export enum TextSize {
  Small = 'small',
  Regular = 'regular',
  Big = 'big',
}

enum DeviceSize {
  Mobile = 'Mobile',
  Desktop = 'Desktop',
}
const fontsSize = {
  [DeviceSize.Mobile]: {
    [TextSize.Small]: '12px',
    [TextSize.Regular]: '14px',
    [TextSize.Big]: '18px',
  },
  [DeviceSize.Desktop]: {
    [TextSize.Small]: '13px',
    [TextSize.Regular]: '16px',
    [TextSize.Big]: '20px',
  },
}

// SECTION

export const SectionTitle = styled.h2<{
  align?: TextAlign
  topMargin?: boolean
  bottomMargin?: boolean
  color?: Colors | string
}>`
  font-weight: 500;
  font-size: 30px;
  line-height: 1.5em;
  color: ${({ color }) => (color ? color : colors.text)};
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};
  ${({ topMargin }) => (topMargin ? '' : 'margin-top: 0;')}
  ${({ bottomMargin }) => (bottomMargin ? '' : 'margin-bottom: 0;')}
`

export const SectionText = styled.p<{
  align?: TextAlign
  size?: TextSize
  color?: Colors | string
}>`
  font-weight: 400;
  line-height: 1.3em;
  margin: 0 0 0.5em;
  color: ${({ theme, color }) => (theme[color]? theme[color]: color ? color : colors.text)};
  font-size: ${({ size }) =>
    size
      ? fontsSize[DeviceSize.Desktop][size]
      : fontsSize[DeviceSize.Desktop][TextSize.Regular]};
  text-align: ${({ align }) => (align ? align : TextAlign.Left)};

  @media ${({ theme }) => theme.screenMax.mobileL} {
    font-size: ${({ size }) =>
      size
        ? fontsSize[DeviceSize.Mobile][size]
        : fontsSize[DeviceSize.Mobile][TextSize.Regular]};
  }
`


export const SectionDescription = styled.span`
  color: ${({ theme }) => theme.textAccent1};
`
