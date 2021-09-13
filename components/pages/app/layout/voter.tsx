import styled from 'styled-components'

import { sizes } from '../../../../theme/sizes'

import { Footer } from '../footer'
import { MessageAlert } from '../../../blocks/msg-alert'
import { LoadingAlert } from '../../../blocks/loading-alert'
import { VoteHeader } from '../header/voter'
// import { useRouter } from 'next/router'


const LayoutContainer = styled.div`
  ${({ theme }) => `padding: 20px ${theme.margins.mobile.horizontal} 120px;`}
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
      <VoteHeader />

      <LayoutContainer>{children}</LayoutContainer>

      <Footer />
    </>
  )
}
