import React from 'react'
import styled, { useTheme } from 'styled-components'
import Link from 'next/link'
import { useWallet } from '../hooks/use-wallet'
import { DASHBOARD_PATH } from '../const/routes'
import i18n from '../i18n'

export const Footer = () => {
  const { wallet } = useWallet()
  const theme = useTheme()
  const links = wallet ? LINKS.filter(link => link.logged) : LINKS.filter(link => link.guest)

  return <Container>
    <LogoSection>
      <Link href={wallet ? DASHBOARD_PATH : "/"} passHref>
        <HomeLink target='_self'><img src="/media/logo-full.svg" alt="Vocdoni" /></HomeLink>
      </Link>

    </LogoSection>
    
    <Link href='https://aragon.org/' passHref>
      <AragonLink target='_blank'><img src="/images/common/powered.png" alt="Aragon" /></AragonLink>
    </Link>

    <LinksSection color={theme.lightText}>
      {links.map(({ url, name, external }, i) => (
        <div key={name}>
          <Link href={url} passHref>
            <ClickableText target={external ? '_blank' : '_self'}>
              {name}
            </ClickableText>
          </Link>
        </div>
      ))}    
    </LinksSection>
  </Container>
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
`

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 40px 0;
  color: ${({ color }) => color};
`
const LogoSection = styled.div`
  margin-left: 40px;
`

const LinksSection = styled.div`
  margin-right: 90px;
  display: flex;
  flex-wrap: wrap;
`

const ClickableText = styled.a`
  margin-left: 40px;
  text-decoration: none;
  color: ${({ theme }) => theme.lightText};
`

const HomeLink = styled.a`
  cursor: pointer;

  & > img {
    margin-right: 20px;
    height: 35px;
  }
`

const AragonLink = styled.a`
  cursor: pointer;
  margin-top: -6px;

  & > img {
    margin-right: 20px;
    height: 45px;
  }
`

interface HeaderLink {
  name: string;
  url: string;
  external?: boolean;
  logged?: boolean;
  guest?: boolean;
}


const LINKS: HeaderLink[] = [
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
  // {
  //   url: 'https://discord.gg/sQCxgYs',
  //   name: 'Discord',
  //   external: true,
  //   logged: false,
  //   guest: true
  // },
  {
    // url: ABOUT_PATH,
    url: "https://vocdoni.io",
    name: i18n.t("links.about"),
    external: false,
    logged: false,
    guest: true
  },
  {
    url: 'https://discord.gg/sQCxgYs',
    name: i18n.t("links.support"),
    external: true,
    logged: true,
    guest: false
  },
]
