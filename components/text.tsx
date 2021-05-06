import styled from "styled-components";
import { colors } from "../theme/colors";
import { Colors } from '../theme/types'

// MAIN

export const MainTitle = styled.h1`
margin-top: 0;
margin-bottom: 10px;
`

export const MainDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`

export enum TextAlign {
  Center = 'center',
  Justify = 'justify',
  Left = 'left',
  Right = 'right',
}

export enum TextSize {
  Small = '14px',
  Regular = '18px',
  Big = '28px'
}

// SECTION

export const SectionTitle = styled.h2<{ align?: TextAlign, topMargin?: boolean, bottomMargin?: boolean, color?: Colors | string}>`
font-weight: 500;
font-size: 38px;
line-height: 1.3em;
color: ${({color}) => color? color: colors.text};
text-align: ${({align}) => align ? align: TextAlign.Left};
${({ topMargin }) => topMargin ? "" : "margin-top: 0;"}
${({ bottomMargin }) => bottomMargin ? "" : "margin-bottom: 0;"}
`

export const SectionText = styled.p<{align?: TextAlign, size?: TextSize, color?: Colors | string}>`
  font-weight: 400;
  line-height: 1.3em;
  margin: 0 0 0.5em;
  color: ${({color}) => color? color: colors.text};
  font-size: ${({size}) => size? size: TextSize.Regular};
  text-align: ${({align}) => align ? align : TextAlign.Left}
`

export const SectionDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`

