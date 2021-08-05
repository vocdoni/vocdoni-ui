import React, { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { useEntity } from '@vocdoni/react-hooks'
import { useTranslation } from 'react-i18next';

import i18n, { supportedLanguages } from '@i18n'

import { useWallet } from '@hooks/use-wallet'
import { useHelpCenter } from '@hooks/help-center'


import { Typography, TypographyVariant } from '@components/elements/typography'
import Dropdown, { DropdownItem, DropdownTitle, DropdownSeparator } from '@components/blocks/dropdown'
import { Button } from '@components/elements/button'
import { Image } from '@components/elements/image'
import { ImageContainer } from '@components/elements/images'

import { ACCOUNT_BACKUP_PATH, DASHBOARD_PATH, EDIT_ENTITY, ENTITY_SIGN_IN_PATH, PAGE_ENTITY } from '@const/routes'
import { useCookies } from '@hooks/cookies'
import { colors } from '@theme/colors'
import RouterService from '@lib/router'

import { Header } from './header'
import { useRecoilStateLoadable } from 'recoil'
import { AccountSelector } from 'recoil/selectors/account'
import styled from 'styled-components'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { Account } from '@lib/types'
import { LanguageService } from '@lib/language-service';

export const EntityHeader = () => {
  const { wallet, setWallet } = useWallet()
  const { i18n } = useTranslation()

  const [showLanguageSelector, setShowLanguageSelector] = useState<Boolean>(false)
  const [{ contents: account }, setAccount ] = useRecoilStateLoadable<Account>(AccountSelector(wallet?.address))
  // const setAccount = useSetRecoilState(AccountsState)
  const { metadata: entityMetadata } = useEntity(wallet?.address)

  const { show } = useHelpCenter()
  const { accepted } = useCookies()

  useEffect(() => {
    if (accepted) show()
  }, [accepted])

  const supportedLanguagesLocale = {
    ca: i18n.t('supported_langs.catalan'),
    en: i18n.t('supported_langs.english'),
    eo: i18n.t('supported_langs.esperanto'),
    es: i18n.t('supported_langs.spanish')
  }

  const handleChangeLanguage = (language: string) => {
    const userAccount = {...account, locale: language}

    i18n.changeLanguage(language)

    LanguageService.setDefaultLanguage(language)
    setShowLanguageSelector(false)
    setAccount(userAccount)
  }

  const handleDisconnectAccount = () => {
    setWallet(null)
  }

  const entityPublicPath = RouterService.instance.get(PAGE_ENTITY, { entityId: wallet?.address })

  const menuButton = (<Button>
    <ImageContainer width='25px' height='25px'>
      <Image src={entityMetadata?.media?.avatar} />
    </ImageContainer>

    <Typography margin='0 0 0 10px' variant={TypographyVariant.Small}>
      {account?.name}
    </Typography>
  </Button>)

  const navMenu = (
    <>
      <DropdownTitle onClick={() => setShowLanguageSelector(true)}>
        <Typography variant={TypographyVariant.ExtraSmall} color={colors.darkLightFg} margin='0'>{i18n.t('app.header.settings')}</Typography>
      </DropdownTitle>

      <DropdownSeparator />
      
      <DropdownItem href={DASHBOARD_PATH}>
        <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.dashboard')}</Typography>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem href={entityPublicPath}>
        <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.public_page')}</Typography>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem href={EDIT_ENTITY}>
        <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.update_entity')}</Typography>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem href={ACCOUNT_BACKUP_PATH}>
        <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.create_account_backup')}</Typography>
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
          <div  key={lang}>
            <DropdownItem onClick={() => handleChangeLanguage(lang)}>
              <Typography variant={TypographyVariant.Small} margin='0'>{langName}</Typography>
            </DropdownItem>

            <DropdownSeparator />
          </div>
        )
      })}

    </>
  )

  return (
    <Header hasReadyAccount={!!account}>
      <If condition={!!account}>
        <Then>
          <Dropdown toggleButton={menuButton}>
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