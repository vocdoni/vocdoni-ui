import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import i18n from '../../i18n'

import { Column, Grid } from '@components/elements/grid'
import { PageCard } from '@components/elements/cards'
import { SignInImport } from '@components/pages/login'
import { SignInForm } from '@components/blocks/sign-in-form'

import { Account, AccountStatus } from '@lib/types'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import { useMessageAlert } from '@hooks/message-alert'
import { useResponsive } from '@hooks/use-window-size'
import { CREATE_ACCOUNT_PATH, DASHBOARD_PATH } from '@const/routes'
import { SectionText, SectionTitle } from '@components/elements/text'

const SignInPage = () => {
  const { dbAccounts } = useDbAccounts()
  const { laptop } = useResponsive()
  const { restoreEncryptedWallet } = useWallet()
  const { setAlertMessage } = useMessageAlert()
  const router = useRouter()

  const [verifyingCredentials, setVerifyingCredentials] = useState<boolean>(false)

  const hasAccounts = !!dbAccounts?.length
  const colSmSize = hasAccounts ? 6 : 12

  const handlerSubmit = (account: Account, passphrase: string): Promise<any> => {
    setVerifyingCredentials(true)

    try {
      restoreEncryptedWallet(account.encryptedMnemonic, account.hdPath, passphrase)
      // Did we start creating an account that is not ready yet?
      if (account.status !== AccountStatus.Ready) {
        return router.push(CREATE_ACCOUNT_PATH)
      }

      return router.push(DASHBOARD_PATH)
    } catch (error) {
      setVerifyingCredentials(false)
      setAlertMessage(i18n.t('sign_in.invalid_passphrase'))
      return Promise.reject(null)
    }
  }

  return (
    <PageCard>
      <Grid>
        {hasAccounts ? (
          <Column lg={colSmSize}>
            <HeaderSection>
              <SectionTitle>{i18n.t('sign_in.sign_in')}</SectionTitle>
              <SectionText>{i18n.t('sign_in.select_the_account_to_use_and_enter_your_passphrase')}</SectionText>
            </HeaderSection>
            <SignInForm accounts={dbAccounts} onSubmit={handlerSubmit} disabled={verifyingCredentials} />

            {!laptop && <LoginDivider />}
          </Column>
        ) : null}

        <Column lg={colSmSize}>
          <SignInImport hasAccount={hasAccounts} />
        </Column>
      </Grid>
    </PageCard>
  )
}

const HeaderSection = styled.div`
  padding-bottom: 22px;
`

const LoginDivider = styled.div`
  margin: 15px;
  border-radius: 2px;
  border-bottom: solid 2px ${({ theme }) => theme.lightBorder};
`

export default SignInPage
