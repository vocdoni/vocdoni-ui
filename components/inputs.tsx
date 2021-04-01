import styled from 'styled-components'

export const Input = styled.input<{ wide?: boolean }>`
padding: 11px;
margin-top: 8px;
border: 2px solid #EFF1F7;
box-sizing: border-box;
box-shadow: inset 0px 2px 3px rgba(180, 193, 228, 0.35);
border-radius: 8px;
outline-width: 0;

margin-bottom: 20px;

${({ wide }) => wide ? "width: 100%;" : ""}
`

export const Textarea = styled.textarea<{ wide?: boolean }>`
padding: 11px;
margin-top: 8px;
border: 2px solid #EFF1F7;
box-sizing: border-box;
box-shadow: inset 0px 2px 3px rgba(180, 193, 228, 0.35);
border-radius: 8px;
outline-width: 0;

margin-bottom: 20px;

${({ wide }) => wide ? "width: 100%;" : ""}
`
