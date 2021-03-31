import styled from 'styled-components'

import { Header } from './header'
import { Footer } from './footer'
import { MessageAlert } from './msg-alert'
import { LoadingAlert } from './loading-alert'

const LayoutContainer = styled.div`
  padding: 0 ${({ theme }) => theme.margins.mobile.horizontal};
  margin-bottom: 110px;
  margin-top: 50px;
  max-width: 992px;
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    margin-top: 77px;
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
