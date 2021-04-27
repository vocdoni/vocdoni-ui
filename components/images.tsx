import styled from 'styled-components'

import { FlexContainer, FlexContainerProps } from './flex'

type ImageContainerProps = FlexContainerProps & {
  width: number
  height?: number
}

export const ImageContainer = styled(FlexContainer)<ImageContainerProps>`
  & > img {
    max-width: ${({ width }) => width};
    width: 100%;
    max-height: ${({ height }) => (height ? height : 'auto')};
  }
`
