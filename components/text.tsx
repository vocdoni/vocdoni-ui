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
${({ topMargin }) => topMargin ? "" : "margin-top: 0;"}
${({ bottomMargin }) => bottomMargin ? "" : "margin-bottom: 0;"}
`

export const SectionDescription = styled.span`
color: ${({ theme }) => theme.textAccent1}
`
