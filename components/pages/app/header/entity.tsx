import React, { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { useEntity } from '@vocdoni/react-hooks'
import { useTranslation } from 'react-i18next';
import { useRecoilStateLoadable, useRecoilValueLoadable } from 'recoil'
import styled from 'styled-components'

import { supportedLanguages } from '@i18n'

import { useWallet } from '@hooks/use-wallet'
import { useHelpCenter } from '@hooks/help-center'


import { Typography, TypographyVariant } from '@components/elements/typography'
import Dropdown, { DropdownItem, DropdownTitle, DropdownSeparator } from '@components/blocks/dropdown'
import { Button } from '@components/elements/button'
import { Image } from '@components/elements/image'
import { ImageContainer } from '@components/elements/images'

import { ACCOUNT_BACKUP_PATH, ACCOUNT_BRANDING, DASHBOARD_PATH, EDIT_ENTITY, ENTITY_SIGN_IN_PATH, PAGE_ENTITY, SUBSCRIPTION_PAGE } from '@const/routes'
import { useCookies } from '@hooks/cookies'
import { colors } from '@theme/colors'
import RouterService from '@lib/router'

import { Subscription } from '@models/Subscription'

import { AccountSelector } from '@recoil/selectors/account'
import { accountFeaturesSelector } from '@recoil/selectors/account-features';

import { entityRegistryState, IEntityRegistryState } from '@recoil/atoms/entity-registry'
import { subscriptionSelector } from '@recoil/selectors/subscription'

import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Account } from '@lib/types'
import { LanguageService } from '@lib/language-service';

import { Header } from './header'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
import { Features } from '@recoil/atoms/account-features';
import { FALLBACK_ACCOUNT_ICON } from '@const/account';

export const EntityHeader = () => {
  const { wallet, setWallet } = useWallet()
  const { i18n } = useTranslation()

  const [showLanguageSelector, setShowLanguageSelector] = useState<Boolean>(false)
  const [{ contents: account }, setAccount] = useRecoilStateLoadable<Account>(AccountSelector(wallet?.address))
  const { contents: features, state: featureState } = useRecoilValueLoadable(accountFeaturesSelector(wallet?.address))

  const { contents: entityRegistryData } = useRecoilValueLoadable<IEntityRegistryState>(entityRegistryState)
  const { contents: entitySubscriptionData, state: entitySubscriptionState } = useRecoilValueLoadable<Subscription>(subscriptionSelector(entityRegistryData.subscriptionId))
  const { metadata: entityMetadata } = useEntity(wallet?.address)

  const { show } = useHelpCenter()
  const { accepted } = useCookies()
  const { trackEvent } = useRudderStack()

  const [menuOpened, setMenuOpened] = useState<boolean>()

  useEffect(() => {
    if (accepted) show()
  }, [accepted])

  const supportedLanguagesLocale = {
    ca: i18n.t('supported_langs.catalan'),
    en: i18n.t('supported_langs.english'),
    eo: i18n.t('supported_langs.esperanto'),
    es: i18n.t('supported_langs.spanish')
  }

  const handleMenuOpen = (isOpen: boolean) => {
    setMenuOpened(isOpen)
  }

  const handleChangeLanguage = (language: string) => {
    const userAccount = { ...account, locale: language }

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
    <MenuButtonWrapper>
      <ImageContainer width='25px' height='25px'>
        <Image src={entityMetadata?.media?.avatar || FALLBACK_ACCOUNT_ICON } />
      </ImageContainer>

      <Typography margin='0 0 0 10px' variant={TypographyVariant.Small}>
        {account?.name}
      </Typography>

      <ArrowContainer>
        <DownArrow opened={menuOpened} />
      </ArrowContainer>
    </MenuButtonWrapper>
  </Button>)

  const navMenu = (
    <>
      <DropdownTitle>
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

      {featureState == 'hasValue' && features?.includes(Features.CustomBranding) &&
        (
          <>
            <DropdownItem href={ACCOUNT_BRANDING}>
              <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.custom_branding')}</Typography>
            </DropdownItem>

            <DropdownSeparator />
          </>
        )
      }
      {entitySubscriptionData && (
        <>
          <DropdownItem href={SUBSCRIPTION_PAGE}>
            <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.subscription')}</Typography>
          </DropdownItem>

          <DropdownSeparator />
        </>
      )}

      <DropdownItem href={ACCOUNT_BACKUP_PATH}>
        <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.create_account_backup')}</Typography>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem href='https://help.aragon.org/collection/54-vocdoni-user-guide' target='_blank'>
        <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.help_and_feedback')}</Typography>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem onClick={() => setShowLanguageSelector(true)} preventClose>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.Small} margin='0'>{i18n.t('app.header.user_language', { lang: supportedLanguagesLocale[account?.locale] })}</Typography>

          <ArrowContainer>
            <NextArrow />
          </ArrowContainer>
        </FlexContainer>
      </DropdownItem>

      <DropdownSeparator />

      <DropdownItem disableHover={true}>
        <Button
          small
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
    <Header hasReadyAccount={!!account}>
      <If condition={!!account}>
        <Then>
          {entitySubscriptionData?.product && <SubscriptionTag>{entitySubscriptionData.product?.title}</SubscriptionTag>}
          <Dropdown toggleButton={menuButton} onUpdate={handleMenuOpen}>
            {showLanguageSelector ? langSelector : navMenu}
          </Dropdown>
        </Then>

        <Else>
          <Button positive small href={ENTITY_SIGN_IN_PATH} wide onClick={() => trackEvent(TrackEvents.LOGIN_BUTTON_CLICKED)}>
            {i18n.t('action.sign_in')}
          </Button>
        </Else>
      </If>
    </Header>
  )
}

const SubscriptionTag = styled.div`
  background-color: ${colors.accent1};
  border-radius: 4px;
  color: ${colors.white};
  font-size: 10px;
  font-weight: bold;
  height: 20px;
  line-height: 20px;
  margin-right: 10px;
  padding: 0 5px;
  text-align: center;
`

const MenuButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 25px;
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
  transition: transform 0.5s ease;
  transform: ${({ opened }) => opened ? 'rotate(-90deg)' : 'rotate(90deg)'};
  font-family: 'manrope';

  &:: after {
    font-size: 22px;
    transform: rotate(-90deg);
    content: '>';
}
`

const ArrowContainer = styled.div`
  // position: absolute;
  // right: 9px;
  // top: 0px;
  margin-left: 10px;
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
