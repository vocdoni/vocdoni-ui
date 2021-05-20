import styled from 'styled-components'

import { sizes } from '../../theme/sizes'

import { Header } from '../header'
import { Footer } from '../footer'
import { MessageAlert } from '../msg-alert'
import { LoadingAlert } from '../loading-alert'
// import { useRouter } from 'next/router'


const LayoutContainer = styled.div`
  ${({ theme }) => `padding: 110px ${theme.margins.mobile.horizontal} 120px;`}
  max-width: ${sizes.laptopL * 0.8}px;
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    ${({ theme }) => `padding: 110px ${theme.margins.desktop.horizontal} 120px;`}
  }
`

export const LayoutVoter = ({ children }) => {
  // const router = useRouter();
  // const isHomePage = router.pathname === '/'

  return (
    <>
      <MessageAlert />
      <LoadingAlert />
      <Header />

      <LayoutContainer>{children}</LayoutContainer>

      <Footer />
    </>
  )
}
