import styled from 'styled-components'

import { sizes } from '../../../../theme/sizes'
import { useWallet } from '../../../../hooks/use-wallet'

import { Footer } from '../footer'
import { MessageAlert } from '../../../blocks/msg-alert'
import { LoadingAlert } from '../../../blocks/loading-alert'
import { Loader } from '../../../blocks/loader'
import { EntityHeader } from '../header/entity'


const LayoutContainer = styled.div`
  ${({ theme }) => `padding: 32px ${theme.margins.mobile.horizontal} 96px;`}
  max-width: ${sizes.laptopL * 0.8}px;
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    ${({ theme }) => `padding: 32px ${theme.margins.desktop.horizontal} 96px;`}
  }
`

export const LayoutEntity = ({ children }) => {
  const { checkingNeedsSignin } = useWallet();

  return (
    <>
      <MessageAlert />
      <LoadingAlert />
      <EntityHeader />

      <Loader visible={checkingNeedsSignin} />
      <LayoutContainer>{children}</LayoutContainer>

      <Footer />
    </>
  )
}
