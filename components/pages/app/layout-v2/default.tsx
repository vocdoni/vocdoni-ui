import styled from 'styled-components'
import { useRouter } from 'next/router'

import { sizes } from '../../../../theme/sizes'
import { useWallet } from '../../../../hooks/use-wallet'

import { MessageAlert } from '../../../blocks/msg-alert'
import { LoadingAlert } from '../../../blocks/loading-alert'
import { Loader } from '../../../blocks/loader'
import { Footer } from '../footer'
import { EntityHeader } from '../header/entity'


const LayoutContainer = styled.div<{isHomePage?: boolean}>`
  ${({isHomePage, theme}) => isHomePage? 'padding: 110px 0;': `padding: 110px ${theme.margins.mobile.horizontal} 120px;`}
  ${({isHomePage}) => isHomePage? '': `max-width: ${sizes.laptopL}px;` }
  margin-left: auto;
  margin-right: auto;

  @media ${({ theme }) => theme.screenMin.tablet} {
    ${({isHomePage, theme}) => isHomePage? 'padding: 110px 0;': `padding: 110px ${theme.margins.desktop.horizontal} 120px;`}
  }
`

export const DefaultLayout = ({ children }) => {
  const { checkingNeedsSignin } = useWallet();
  const router = useRouter();
  const isHomePage = router.pathname === '/'

  return (
    <>
      <MessageAlert />
      <LoadingAlert />
      <EntityHeader />

      <Loader visible={checkingNeedsSignin} />
      <LayoutContainer isHomePage={isHomePage}>{children}</LayoutContainer>

      <Footer />
    </>
  )
}
