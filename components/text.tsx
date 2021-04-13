import styled from "styled-components";

// MAIN

export const MainTitle = styled.h1`
margin-top: 0;
margin-bottom: 10px;
`

export const MainDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`

// SECTION

export const SectionTitle = styled.h2<{ topMargin?: boolean, bottomMargin?: boolean }>`
font-weight: 500;
size: 44px;
line-height: 1.3em;
${({ topMargin }) => topMargin ? "" : "margin-top: 0;"}
${({ bottomMargin }) => bottomMargin ? "" : "margin-bottom: 0;"}
`

export const SectionTitleCentered = styled(SectionTitle)`
text-align: center;
`

export const SectionText = styled.p`
font-weight: 400;
font-size: 18px;
line-height: 1.3em;
`
export const SectionTextCentered = styled(SectionText)`
text-align: center
`

export const SectionDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`
