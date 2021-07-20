import styled from 'styled-components'

type LineProps = {
  color?: string,
}

export const Line = styled.hr<{color?: string}>`
  color: ${({ color, theme }) => (color ? color : theme.lightBorder)};
`
