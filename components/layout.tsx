import styled from 'styled-components'

import { Header } from './header'
import { Footer } from './footer'
import { MessageAlert } from './msg-alert'
import { LoadingAlert } from './loading-alert'
import { sizes } from '../theme/sizes'

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

export const Layout = ({ children }) => (
  <>
    <MessageAlert />
    <LoadingAlert />
    <Header />
    <LayoutContainer>{children}</LayoutContainer>
    <Footer />
  </>
)
