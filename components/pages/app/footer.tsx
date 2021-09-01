import React from 'react'
import styled, { useTheme } from 'styled-components'
import Link from 'next/link'
import { useWallet } from '../../../hooks/use-wallet'
import { DASHBOARD_PATH, PRIVACY_PATH } from '../../../const/routes'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { i18n } = useTranslation()

  const { wallet } = useWallet()
  const theme = useTheme()

  const LINKS: HeaderLink[] = [
    {
      url: PRIVACY_PATH,
      name: i18n.t("links.privacy_policy"),
      external: true,
      logged: true,
      guest: true
    },
    {
      url: DASHBOARD_PATH,
      name: i18n.t("links.dashboard"),
      external: false,
      logged: true,
      guest: false
    },
    {
      url: 'https://blog.vocdoni.io',
      name: i18n.t("links.blog"),
      external: true,
      logged: true,
      guest: true
    },
    // {
    //   url: PRICING_PATH,
    //   name: i18n.t("links.pricing"),
    //   external: false,
    //   logged: false,
    //   guest: true
    // },
    {
      url: 'https://docs.vocdoni.io',
      name: i18n.t("links.docs"),
      external: true,
      logged: true,
      guest: true
    },
    {
      url: 'https://help.aragon.org/collection/54-vocdoni-user-guide',
      name: i18n.t("links.help"),
      external: true,
      logged: true,
      guest: true
    },
    {
      // url: ABOUT_PATH,
      url: "https://vocdoni.io",
      name: i18n.t("links.about"),
      external: false,
      logged: false,
      guest: true
    },
    {
      url: 'https://discord.gg/8p8NSD4e2n',
      name: i18n.t("links.support"),
      external: true,
      logged: true,
      guest: false
    },
  ]

  const links = wallet ? LINKS.filter(link => link.logged) : LINKS.filter(link => link.guest)

  return (
    <Container>
      <LogoSection>
        <Link href={wallet ? DASHBOARD_PATH : "/"} passHref>
          <HomeLink target='_self'><img src="/media/logo-full.svg" alt="Vocdoni" /></HomeLink>
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
          <SocialLinkContainer href="https://www.youtube.com/channel/UCt4ZGAb5S8KKZlkdH0P7OzA" target="_blank">
            <img src="/images/home/footer/youtube.svg" alt="Youtube" />
          </SocialLinkContainer>

          <SocialLinkContainer href="https://discord.gg/8p8NSD4e2n" target="_blank">
            <img src="/images/home/footer/discord.svg" alt="Discord" />
          </SocialLinkContainer>

          <SocialLinkContainer href="https://twitter.com/vocdoni" target="_blank">
            <img src="/images/home/footer/twitter.svg" alt="Twitter" />
          </SocialLinkContainer>

          <SocialLinkContainer href="https://t.me/vocdoni_community" target="_blank">
            <img src="/images/home/footer/telegram.svg" alt="telegram" />
          </SocialLinkContainer>
        </SocialLinksSection>
      </LinksSection>

      <Link href='https://aragon.org/' passHref>
        <AragonLink target='_blank'><img src="/images/common/powered.svg" alt="Aragon" /></AragonLink>
      </Link>
    </Container>
  )
}

const Container = styled.div`
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

  @media ( max-width: 1124px ){
    height: auto;
    flex-direction: column;
    position: relative;
    margin-top: -100px;
  }
`

const NavItem = styled.div`
  margin-right: 30px;

  @media ( max-width: 1124px ){
    text-align: center; 
  }
`

const SocialLinksSection = styled.div`
  display: flex;
  align-items: center;
`
const SocialLinkContainer = styled.a`
  margin: 0 6px;
  
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

  @media ( max-width: 1124px ){
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
    height: 54px;
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
  name: string;
  url: string;
  external?: boolean;
  logged?: boolean;
  guest?: boolean;
}
