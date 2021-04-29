import styled from 'styled-components'

import { FlexContainer, FlexContainerProps } from './flex'

type ImageContainerProps = FlexContainerProps & {
  width: number
  height?: number
}

export const ImageContainer = styled(FlexContainer) <ImageContainerProps>`
  & > img {
    max-width: ${({ width }) => width}px;
    width: 100%;
    max-height: ${({ height }) => (height ? height + "px" : 'auto')};
  }
`
