import styled from 'styled-components'

import { FlexContainer, FlexContainerProps } from './flex'

type ImageContainerProps = FlexContainerProps & {
  width: string,
  smWidth?: string,
  mdWidth?: string,
  lgWidth?: string,
  xlWidth?: string,
}

export const ImageContainer = styled(FlexContainer)<ImageContainerProps>`
  & > img {
    max-width: ${({ width }) => width? width: 'auto'};
    width: 100%;
    max-height: ${({ height }) => (height ? height: 'inherit')};


    @media ${({ theme }) => theme.screenMin.mobileM}{
      max-width: ${({ smWidth, width }) => smWidth? smWidth: width};
    }

    @media ${({ theme }) => theme.screenMin.tablet}{
      max-width: ${({ mdWidth, width }) => mdWidth? mdWidth: width};
    }

    @media ${({ theme }) => theme.screenMin.laptopL}{
      max-width: ${({ lgWidth, width }) => lgWidth? lgWidth: width};
    }

    @media ${({ theme }) => theme.screenMin.desktop}{
      max-width: ${({ xlWidth, width }) => xlWidth? xlWidth: width};
    }
  }
`
