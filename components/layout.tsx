import styled from 'styled-components'

import { sizes } from '../theme/sizes'
import { useWallet } from '../hooks/use-wallet'

import { Header } from './header'
import { Footer } from './footer'
import { MessageAlert } from './msg-alert'
import { LoadingAlert } from './loading-alert'
import { Loader } from './loader'
import { useRouter } from 'next/router'


const LayoutContainer = styled.div<{isHomePage?: boolean}>`
  ${({isHomePage, theme}) => isHomePage? 'padding: 110px 0;': `padding: 110px ${theme.margins.mobile.horizontal} 120px;`}
  ${({isHomePage}) => isHomePage? '': `max-width: ${sizes.laptopL * 0.8}px;` }
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    ${({isHomePage, theme}) => isHomePage? 'padding: 110px 0;': `padding: 110px ${theme.margins.desktop.horizontal} 120px;`}
  }
`

export const Layout = ({ children }) => {
  const { checkingNeedsSignin } = useWallet();
  const router = useRouter();
  const isHomePage = router.pathname === '/'

  return (
    <>
      <MessageAlert />
      <LoadingAlert />
      <Header />

      <Loader visible={checkingNeedsSignin} />
      <LayoutContainer isHomePage={isHomePage}>{children}</LayoutContainer>

      <Footer />
    </>
  )
}
