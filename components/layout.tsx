import styled from 'styled-components'

import { sizes } from '../theme/sizes'
import { useWallet } from '../hooks/use-wallet'

import { Header } from './header'
import { Footer } from './footer'
import { MessageAlert } from './msg-alert'
import { LoadingAlert } from './loading-alert'
import { Loader } from './loader'


const LayoutContainer = styled.div`
  padding: 0 ${({ theme }) => theme.margins.mobile.horizontal};
  margin-bottom: 110px;
  margin-top: 77px;
  max-width: ${sizes.laptopL * 0.8}px;
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    padding: 0 ${({ theme }) => theme.margins.desktop.horizontal};
  }
`

export const Layout = ({ children }) => {
  const { loadingWallet } = useWallet();
  
  return (
    <>
      <MessageAlert />
      <LoadingAlert />
      <Header />
      
      <Loader visible={loadingWallet} />
      <LayoutContainer>{children}</LayoutContainer>
      <Footer />
    </>
  )
}
