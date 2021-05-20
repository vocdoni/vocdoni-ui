import styled from 'styled-components'

import { sizes } from '../../theme/sizes'
import { useWallet } from '../../hooks/use-wallet'

import { Header } from '../header'
import { Footer } from '../footer'
import { MessageAlert } from '../msg-alert'
import { LoadingAlert } from '../loading-alert'
import { Loader } from '../loader'


const LayoutContainer = styled.div`
  ${({ theme }) => `padding: 110px ${theme.margins.mobile.horizontal} 120px;`}
  max-width: ${sizes.laptopL * 0.8}px;
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    ${({ theme }) => `padding: 110px ${theme.margins.desktop.horizontal} 120px;`}
  }
`

export const LayoutEntity = ({ children }) => {
  const { checkingNeedsSignin } = useWallet();

  return (
    <>
      <MessageAlert />
      <LoadingAlert />
      <Header />

      <Loader visible={checkingNeedsSignin} />
      <LayoutContainer>{children}</LayoutContainer>

      <Footer />
    </>
  )
}
