import styled from 'styled-components'

export const Label = styled.label<{color?: string}>`
  color: ${({ theme, color}) => color? color: theme.text };
`