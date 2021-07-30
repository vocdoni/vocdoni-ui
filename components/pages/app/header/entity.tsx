import React, { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { useEntity } from '@vocdoni/react-hooks'

import i18n, { supportedLanguages } from '@i18n'

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
import { useRecoilState, useRecoilValueLoadable, useRecoilStateLoadable } from 'recoil'
import { AccountSelector } from 'recoil/selectors/account'
import styled from 'styled-components'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'

export const supportedLanguagesLocale = {
  ca: i18n.t('supported_langs.catalan'),
  en: i18n.t('supported_langs.english'),
  eo: i18n.t('supported_langs.esperanto'),
  es: i18n.t('supported_langs.spanish')
}

export const EntityHeader = () => {
  // const [account, setAccount] = useState<Account>()
  const [showLanguageSelector, setShowLanguageSelector] = useState<Boolean>(false)
  const [userLanguage, setUserLanguage] = useState<string>()
  const { wallet, setWallet } = useWallet()
  const [{ contents: account } , setAccount] = useRecoilStateLoadable(AccountSelector(wallet?.address))
  const { metadata: entityMetadata } = useEntity(wallet?.address)
  console.log('The account are')
  console.log(account)
  const { getAccount } = useDbAccounts()
  const { show } = useHelpCenter()
  const { accepted } = useCookies()

  useEffect(() => {

  }, [])

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


  const entityPublicPath = RouterService.instance.get(PAGE_ENTITY, { entityId: wallet?.address })

  useEffect(() => {
    if (accepted) show()
  }, [accepted])

  const handleChangeLanguage = (language: string) => {
    
    setUserLanguage(language)
  }
  // useEffect(() => {
  //   if (!wallet) return

  //   const account = getAccount(wallet?.address)

  //   if (
  //     account &&
  //     (
  //       typeof account.status === 'undefined' ||
  //       account.status === AccountStatus.Ready
  //     )
  //   ) {
  //     setAccount(account)
  //   }
  // }, [])

  const navMenu = (
    <>
      <DropdownTitle onClick={() => setShowLanguageSelector(true)}>
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

      <DropdownItem onClick={() => setShowLanguageSelector(true)} preventClose>
        <RelativeContainer>
          <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.user_language', { lang: supportedLanguagesLocale[account?.locale] })}</Typography>
          <ArrowContainer>
            <NextArrow />
          </ArrowContainer>
        </RelativeContainer>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem disableHover={true}>
        <Button
          color={colors.accent2}
          border={true}
          onClick={handleDisconnectAccount}
          wide
        >{i18n.t('app.header.disconnect_account')}</Button>
      </DropdownItem>
    </>
  )

  const langSelector = (
    <>
      <DropdownTitle onClick={() => setShowLanguageSelector(false)}>
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <BackArrow /> <Typography variant={TypographyVariant.ExtraSmall} margin='0'>{i18n.t('app.header.language')}</Typography>
        </FlexContainer>
      </DropdownTitle>
      <DropdownSeparator />

      {supportedLanguages.map(lang => {
        const langName = supportedLanguagesLocale[lang]

        return (
          <>
            <DropdownItem onClick={() => setUserLanguage(lang)} key={lang}>
              <Typography variant={TypographyVariant.Small} margin='0'>{langName}</Typography>
            </DropdownItem>

            <DropdownSeparator />
          </>
        )
      })}

    </>
  )

  return (
    <Header hasReadyAccount={!!account}>
      <If condition={!!account}>
        <Then>
          <Dropdown toggleButton={menuButton} width='250px'>
            {showLanguageSelector ? langSelector : navMenu}
          </Dropdown>
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

const RelativeContainer = styled.div`
  position: relative;
`

const BackArrow = styled.span`
  margin-right: 10px;
  margin-top: -4px;
  font-size: 20px;

  &::after {
    content: '<';
  }
`

const ArrowContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const NextArrow = styled.span`
  margin-left: 10px;
  margin-top: -4px; 
  font-size: 20px;

  &::after {
    content: '>';
  }
`