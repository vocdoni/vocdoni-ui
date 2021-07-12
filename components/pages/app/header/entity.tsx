import React, { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { useEntity } from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { useDbAccounts } from '@hooks/use-db-accounts'
import { useWallet } from '@hooks/use-wallet'
import { useHelpCenter } from '@hooks/help-center'


import { Account, AccountStatus } from '@lib/types'
import { Typography, TypographyVariant } from '@components/elements/typography'
import Dropdown, { DropdownItem, DropdownTitle, DropdownSeparator } from '@components/blocks/dropdown'
import { Button } from '@components/elements/button'
import { Image } from '@components/elements/image'
import { ImageContainer } from '@components/elements/images'

import { ACCOUNT_BACKUP_PATH, EDIT_ENTITY, ENTITY_SIGN_IN_PATH, PAGE_ENTITY } from '@const/routes'
import { useCookies } from '@hooks/cookies'
import { colors } from '@theme/colors'
import RouterService from '@lib/router'

import { Header } from './header'

export const EntityHeader = () => {
  const [account, setAccount] = useState<Account>()
  const { wallet, setWallet } = useWallet()
  const { metadata: entityMetadata } = useEntity(wallet?.address)

  const { getAccount } = useDbAccounts()
  const { show } = useHelpCenter()
  const { accepted } = useCookies()

  const menuButton = (<Button>
    <ImageContainer width='25px' height='25px'>
      <Image src={entityMetadata?.media?.avatar} />
    </ImageContainer>

    <Typography margin='0 0 0 10px' variant={TypographyVariant.Small}>
      {account?.name}
    </Typography>
  </Button>)

  const handleDisconnectAccount = () => {
    setWallet(null)
  }

  const entityPublicPath = RouterService.instance.get(PAGE_ENTITY, {entityId: wallet?.address})

  useEffect(() => {
    if (accepted) show()
  }, [accepted])

  useEffect(() => {
    if (!wallet) return

    const account = getAccount(wallet?.address)

    if (
      account &&
      (
        typeof account.status === 'undefined' ||
        account.status === AccountStatus.Ready
      )
    ) {
      setAccount(account)
    }
  }, [])

  return (
    <Header hasReadyAccount={!!account}>
      <If condition={!!account}>
        <Then>
          <Dropdown toggleButton={menuButton} >
            <DropdownTitle>
              <Typography variant={TypographyVariant.ExtraSmall} color={colors.darkLightFg} margin='0'>{i18n.t('app.header.settings')}</Typography>
            </DropdownTitle>

            <DropdownSeparator />

            <DropdownItem href={ACCOUNT_BACKUP_PATH}>
              <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.create_account_backup')}</Typography>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem href={EDIT_ENTITY}>
              <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.update_entity')}</Typography>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem href={entityPublicPath}>
              <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.public_page')}</Typography>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem href='https://help.aragon.org/collection/54-vocdoni-user-guide' target='_blank'>
              <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.help_and_feedback')}</Typography>
            </DropdownItem>

            <DropdownSeparator />

            <DropdownItem disableHover={true}>
              <Button
                color={colors.accent2}
                border={true}
                onClick={handleDisconnectAccount}
              >{i18n.t('app.header.disconnect_account')}</Button>
            </DropdownItem>
          </Dropdown>
        </Then>

        <Else>
          <Button positive small href={ENTITY_SIGN_IN_PATH}>
            {i18n.t('action.sign_in')}
          </Button>
        </Else>
      </If>
    </Header>
  )
}
