import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import i18n from '../../i18n'

import { Column, Grid } from '../../components/grid'
import { PageCard } from '../../components/cards'
import { LogInForm } from '../../components/login/form'
import { LogInImport } from '../../components/login/import'
import { Account } from '../../lib/types'
import { useDbAccounts } from '../../hooks/use-db-accounts'
import { useWallet } from '../../hooks/use-wallet'
import { useMessageAlert } from '../../hooks/message-alert'
import { DASHBOARD_PATH } from '../../const/routes'

const LogInPage = () => {
  const { dbAccounts } = useDbAccounts()
  const { restoreEncryptedWallet } = useWallet()
  const { setAlertMessage } = useMessageAlert()
  const router = useRouter()

  const hasAccounts = !!dbAccounts.length
  const colSmSize = hasAccounts ? 6 : 12

  const handlerSubmit = (account: Account, passphrase: string) => {
    try {
      restoreEncryptedWallet(
        account.encryptedMnemonic,
        account.hdPath,
        passphrase
      )

      router.push(DASHBOARD_PATH)
    } catch (error) {
      setAlertMessage(i18n.t('sign_in.invalid_passphrase'))
    }
  }

  return (
    <PageCard>
      <Grid>
        {hasAccounts ? (
          <Column lg={colSmSize}>
            <LogInForm
              accounts={dbAccounts}
              onSubmit={handlerSubmit}
            />
          </Column>
        ) : null}

        <Column lg={colSmSize}>
          <LogInImport hasAccount={hasAccounts} />
        </Column>
      </Grid>
    </PageCard>
  )
}

export default LogInPage
