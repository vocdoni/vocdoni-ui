import styled from 'styled-components'

import { sizes } from '../../../../theme/sizes'
import { MessageAlert } from '../../../blocks/msg-alert'
import { LoadingAlert } from '../../../blocks/loading-alert'

import { VoteHeader } from '../header/voter'
import { VoterFooter } from '../footer/voter'
// import { useRouter } from 'next/router'


const LayoutContainer = styled.div`
  ${({ theme }) => `padding: 20px ${theme.margins.mobile.horizontal} 40px;`}
  max-width: ${sizes.laptopL}px;
  margin-left: auto;
  margin-right: auto;
  flex: 1 0 auto;

  @media ${({ theme }) => theme.screenMax.tablet} {
    ${({ theme }) => `padding: 0px 0px 40px;`}
  }
  @media ${({ theme }) => theme.screenMin.tabletL} {
    ${({ theme }) => `padding: 20px ${theme.margins.desktop.horizontal} 40px;`}
  }
  @media ${({ theme }) => theme.screenMax.mobileL} {
    ${({ theme }) => `padding: 20px 0px 40px;`}
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

      <VoterFooter />
    </>
  )
}
