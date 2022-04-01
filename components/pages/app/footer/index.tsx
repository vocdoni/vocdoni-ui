import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { useWallet } from '../../../../hooks/use-wallet'
import { DASHBOARD_PATH, PRIVACY_PATH } from '../../../../const/routes'

import { Image } from '@components/elements/image'
import { useTheme } from '@hooks/use-theme'

export const Footer = () => {
  const { i18n } = useTranslation()

  const { wallet } = useWallet()
  const { theme } = useTheme()

  const LINKS: HeaderLink[] = [
    // {
    //   url: 'https://tally.so/r/w8dqxw',
    //   name: i18n.t('links.requests_and_bugs'),
    //   external: true,
    //   logged: true,
    //   guest: true,
    // },
    {
      url: PRIVACY_PATH,
      name: i18n.t('links.privacy_policy'),
      external: true,
      logged: true,
      guest: true,
    },
    {
      url: 'https://www.coec.cat/ca/',
      name: i18n.t('links.coec_web'),
      external: true,
      logged: true,
      guest: true,
    },
  ]

  const links = wallet
    ? LINKS.filter((link) => link.logged)
    : LINKS.filter((link) => link.guest)

  return (
    <FooterContainer>
      <LogoSection>
        <Link href={wallet ? DASHBOARD_PATH : '/'} passHref>
          <HomeLink target="_self">
            {theme.customLogo ? (
              <Image src={theme.customLogo} />
            ) : (
              <img src="/media/logo_coec.svg" alt="Vocdoni" />
            )}
          </HomeLink>
        </Link>
      </LogoSection>

      <LinksSection color={theme.lightText}>
        {links.map(({ url, name, external }, i) => (
          <NavItem key={name}>
            <Link href={url} passHref>
              <ClickableText target={external ? '_blank' : '_self'}>
                {name}
              </ClickableText>
            </Link>
          </NavItem>
        ))}

        <SocialLinksSection>
          <SocialLinkContainer
            href="https://www.youtube.com/channel/UCfQ3JmnAvXYJn4Ms_S1N1OQ"
            target="_blank"
          >
            <img src="/images/home/footer/youtube.svg" alt="Youtube" />
          </SocialLinkContainer>

          <SocialLinkContainer
            href="https://twitter.com/COECoficial?s=20&t=UPAo9jPEZWql9__m4k8ATw"
            target="_blank"
          >
            <img src="/images/home/footer/twitter.svg" alt="Twitter" />
          </SocialLinkContainer>
          <SocialLinkContainer
            href="https://www.facebook.com/COECCatalunya/?ref=page_internal"
            target="_blank"
          >
            <img src="/images/home/footer/facebook.svg" alt="Facebook" />
          </SocialLinkContainer>
        </SocialLinksSection>
      </LinksSection>

      {!theme.customLogo && (
        <Link href="https://aragon.org/" passHref>
          <AragonLink target="_blank">
            <img src="/images/common/powered.svg" alt="Aragon" />
          </AragonLink>
        </Link>
      )}
    </FooterContainer>
  )
}

export const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  font-size: 13px;
  height: 90px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 1124px) {
    height: auto;
    flex-direction: column;
    position: relative;
    margin-top: -100px;
  }
`

const NavItem = styled.div`
  margin-right: 30px;

  @media (max-width: 1124px) {
    text-align: center;
  }
`

const SocialLinksSection = styled.div`
  display: flex;
  align-items: center;
`
const SocialLinkContainer = styled.a`
  margin: 0 6px;

  & > a {
    color: 'blue';
  }

  & > img {
    max-width: 20px;
    max-height: 20px;
  }
`

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 40px 0;
  color: ${({ color }) => color};
`
const LogoSection = styled.div`
  margin-left: 40px;

  @media (max-width: 1124px) {
    margin: 20px auto 0;
  }
`

const LinksSection = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    margin-top: 10px;
    align-items: center;
    justify-content: center;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }
`

const ClickableText = styled.a`
  text-decoration: none;
  line-height: 30px;
  color: ${({ theme }) => theme.lightText};
`

const HomeLink = styled.a`
  cursor: pointer;

  & > img {
    margin-right: 20px;
    height: 30px;
  }
`

const AragonLink = styled.a`
  cursor: pointer;
  margin-right: 70px;

  & > img {
    margin - right: 20px;
    height: 32px;
  }

  @media  ( max-width: 1124px ){
    margin: 20px auto;
  }
`

interface HeaderLink {
  name: string
  url: string
  external?: boolean
  logged?: boolean
  guest?: boolean
}
