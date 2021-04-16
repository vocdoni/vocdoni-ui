import styled from "styled-components";

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


// SECTION

export const SectionTitle = styled.h2<{  align: TextAlign, topMargin?: boolean, bottomMargin?: boolean }>`
font-weight: 500;
size: 44px;
line-height: 1.3em;
text-align: ${({align}) => align? align: TextAlign.Center};
${({ topMargin }) => topMargin ? "" : "margin-top: 0;"}
${({ bottomMargin }) => bottomMargin ? "" : "margin-bottom: 0;"}
`

export const SectionText = styled.p<{align?: TextAlign}>`
font-weight: 400;
font-size: 18px;
line-height: 1.3em;
text-align: ${({align}) => align? align: TextAlign.Center}
`

export const SectionDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`


