import React, { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { useEntity } from '@vocdoni/react-hooks'
import { useTranslation } from 'react-i18next';
import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import styled from 'styled-components'

import { supportedLanguages } from '@i18n'
import { useWallet } from '@hooks/use-wallet'

import { Typography, TypographyVariant } from '@components/elements/typography'
import Dropdown, { DropdownItem, DropdownTitle, DropdownSeparator } from '@components/blocks/dropdown'
import { Button } from '@components/elements/button'
import { Image } from '@components/elements/image'
import { ImageContainer } from '@components/elements/images'

import { ACCOUNT_BACKUP_PATH, ACCOUNT_BRANDING, DASHBOARD_PATH, EDIT_ENTITY, ENTITY_SIGN_IN_PATH, PAGE_ENTITY } from '@const/routes'
import { useCookies } from '@hooks/cookies'
import { colors } from '@theme/colors'
import RouterService from '@lib/router'

import { AccountSelector } from '@recoil/selectors/account'
import { accountFeaturesSelector } from '@recoil/selectors/account-features';

import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { Account } from '@lib/types'
import { LanguageService } from '@lib/language-service';

import { Header } from './header'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
import { Features } from '@recoil/atoms/account-features';
import { FALLBACK_ACCOUNT_ICON } from '@const/account';

export const LangDropdown = () => {
  const { wallet, setWallet } = useWallet()
  const { i18n } = useTranslation()

  const [showLanguageSelector, setShowLanguageSelector] = useState<Boolean>(false)
  const [{ contents: account }, setAccount] = useRecoilStateLoadable<Account>(AccountSelector(wallet?.address))
  const { contents: features, state: featureState } = useRecoilValueLoadable(accountFeaturesSelector(wallet?.address))

  const { metadata: entityMetadata } = useEntity(wallet?.address)

  const { accepted } = useCookies()
  const { trackEvent } = useRudderStack()

  const [menuOpened, setMenuOpened] = useState<boolean>()

  const supportedLanguagesLocale = {
    ca: i18n.t('supported_langs.catalan'),
    en: i18n.t('supported_langs.english'),
    es: i18n.t('supported_langs.spanish')
  }

  const handleMenuOpen = (isOpen: boolean) => {
    setMenuOpened(isOpen)
  }

  const handleChangeLanguage = (language: string) => {
    //const userAccount = { ...account, locale: language }

    i18n.changeLanguage(language)

    LanguageService.setDefaultLanguage(language)
    setShowLanguageSelector(false)
    //setAccount(userAccount)
  }

  const defaultLang = LanguageService.getDefaultLanguage()
  let showDefaultLang = ''
  if(defaultLang === 'en'){
    showDefaultLang = 'ENG'
  }else if (defaultLang === 'es'){
    showDefaultLang = 'ESP'
  }else{
    showDefaultLang = 'CAT'
  }

  const menuButton = (
    <WrapperDiv>
      <Button>
        <MenuButtonWrapper>
          <TypographyBold>
            {showDefaultLang}
          </TypographyBold>

          <ArrowContainer>
            <DownArrow opened={menuOpened} />
          </ArrowContainer>
        </MenuButtonWrapper>
      </Button>
    </WrapperDiv>
  )

  const langSelector = (
    <>
      {supportedLanguages.map(lang => {
        const langName = supportedLanguagesLocale[lang]

        return (
          <div key={lang}>
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
    <>    
      <Dropdown toggleButton={menuButton} onUpdate={handleMenuOpen}>
        {langSelector}
      </Dropdown>
    </>
  )
}

const TypographyBold = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.accent1};
  text-fill-color: transparent;
  text-align: center;
  margin: 0px 0px 0px 10px;
`

const WrapperDiv = styled.div`
  background: 
    linear-gradient(#fff 0 0) padding-box, /*this is the white background*/
    linear-gradient(to right, #000, #000) border-box;
  border: 2px solid transparent;
  border-radius: 8px;
  display: inline-block;
`

const dropdownMenu = styled.div`
  float:right;
`

const MenuButtonWrapper = styled.div`
  padding-right: 15px;
  display: flex;
  align-items: center;
  margin-left: -15px;
`

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

const DownArrow = styled.div<{ opened?: boolean }>`
  margin-top: 7px;
  transition: transform 0.5s ease;
  transform: ${({ opened }) => opened ? 'rotate(-90deg)' : 'rotate(90deg)'};
  color: #A50044;
  &:: after {
    font-size: 22px;
    transform: rotate(-90deg);
    content: '>';
}
`

const ArrowContainer = styled.div`
  position: absolute;
  right: 9px;
  top: 0px;
  @media ${({theme})  => theme.screenMax.mobileL } {
    top:4px;
  }
`

const NextArrow = styled.span`
  margin-left: 10px;
  margin-top: -4px;
  font-size: 20px;
  line-height: 20px;
    &::after {
    content: '>';
  }
`
