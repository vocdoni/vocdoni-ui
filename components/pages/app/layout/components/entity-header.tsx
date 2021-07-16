import React, { useEffect } from 'react'
import { Else, If, Then } from 'react-if'

import i18n from '@i18n'

import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import { useHelpCenter } from '@hooks/help-center'


import { AccountStatus } from '@lib/types'
import { Button } from '@components/elements/button'

import { DASHBOARD_PATH, ENTITY_SIGN_IN_PATH } from '@const/routes'
import { Header } from './header'
import { useCookies } from '@hooks/cookies'

export const EntityHeader = () => {
  const { wallet } = useWallet()
  const { getAccount } = useDbAccounts()
  const { show } = useHelpCenter()
  const { accepted } = useCookies()
  // const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    if (accepted) show()
  }, [accepted])

  let hasReadyAccount = false

  if (wallet) {
    const account = getAccount(wallet?.address)
    
    hasReadyAccount =
      account &&
      (typeof account.status === 'undefined' ||
        account.status === AccountStatus.Ready)
  }

  return (
    <Header hasReadyAccount={hasReadyAccount}>
      <If condition={!!hasReadyAccount}>
        <Then>
          <Button positive small href={DASHBOARD_PATH} wide>
            {i18n.t('links.dashboard')}
          </Button>
        </Then>
        <Else>
          <Button positive small href={ENTITY_SIGN_IN_PATH} wide>
            {i18n.t('action.sign_in')}
          </Button>
        </Else>
      </If>
    </Header>
  )
}
