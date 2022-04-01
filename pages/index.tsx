import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import i18n from '../i18n'

import { Column, Grid } from '@components/elements/grid'
import { PageCard } from '@components/elements/cards'
import { SignInForm, SignInImport } from '@components/pages/login'
import { Account, AccountStatus } from '@lib/types'
import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import { useResponsive } from '@hooks/use-window-size'
import { CREATE_ACCOUNT_PATH, DASHBOARD_PATH } from '@const/routes'
import { Row } from '@components/elements-v2'

const SignInPage = () => {
  const { dbAccounts } = useDbAccounts()
  const { laptop } = useResponsive()
  const { restoreEncryptedWallet } = useWallet()
  const [loginError, setLoginError] = useState<string | null>(null)
  const router = useRouter()

  const [verifyingCredentials, setVerifyingCredentials] =
    useState<boolean>(false)

  const accountCOEC = [
    {
      name: 'Test COEC',
      address: '0x1dbEcEF87e26AA02533a97D670df476027a3BbA9',
      encryptedMnemonic:
        'WhQQ+lwxTIYOTW/F36yyPtzEbFiZJ7ur0mLXT7ddCuuNFgI+gOHkcoow+aq/CHDliiMhA41ArVkVIqPNspF86gzeuq2aIm2BSVb0fIDmx7Vo3JN54/GB2YaOKN7xRNzK7hHYesOvJvcbJRCqQJV3rfXc3wB/CQoo',
      locale: 'en',
      creation: true,
      email: 'testcoec@test.com',
      hdPath: "m/44'/60'/0'/0/0",
    },
  ]

  const handlerSubmit = (
    account: Account,
    passphrase: string
  ): Promise<any> => {
    setVerifyingCredentials(true)
    setLoginError(null)
    try {
      restoreEncryptedWallet(
        accountCOEC[0].encryptedMnemonic,
        accountCOEC[0].hdPath,
        passphrase
      )
      // Did we start creating an account that is not ready yet?
      // if (account.status !== AccountStatus.Ready) {
      //   return router.push(CREATE_ACCOUNT_PATH)
      // }

      return router.push(DASHBOARD_PATH)
    } catch (error) {
      setLoginError(i18n.t('sign_in.invalid_passphrase'))
      setVerifyingCredentials(false)
      return Promise.reject(null)
    }
  }

  return (
    <PageCard>
      <Grid>
        <Row justify="center">
          <Column lg={6}>
            <SignInForm
              accounts={accountCOEC}
              error={loginError}
              onSubmit={handlerSubmit}
              disabled={verifyingCredentials}
            />

            {!laptop && <LoginDivider />}
          </Column>
        </Row>
      </Grid>
    </PageCard>
  )
}

const LoginDivider = styled.div`
  margin: 15px;
  border-radius: 2px;
  border-bottom: solid 2px ${({ theme }) => theme.lightBorder};
`

export default SignInPage
