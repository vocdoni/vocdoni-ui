import React from 'react'
import styled, { useTheme } from 'styled-components'
import Link from 'next/link'
import { useWallet } from '../../../hooks/use-wallet'
import { DASHBOARD_PATH, PRIVACY_PATH } from '../../../const/routes'
import i18n from '../../../i18n'

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
    <Link href='https://aragon.org/' passHref>
      <AragonLink target='_blank'><img src="/images/common/powered.svg" alt="Aragon" /></AragonLink>
    </Link>
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

  @media ${({theme}) => theme.screenMax.mobileL} {
    height: auto;
    position: relative;
    margin-top: -100px;
  }
`

const NavItem = styled.div`
  margin-right: 30px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    text-align: center; 
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

  @media ${({theme}) => theme.screenMax.mobileL} {
    margin: 20px auto;
  }
`

const LinksSection = styled.div`
  display: flex;
  flex-wrap: wrap;

  @media ${({theme}) => theme.screenMax.mobileL} {
    flex-direction: column; 
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
    margin-right: 20px;
    height: 32px;
  }

  @media ${({theme}) => theme.screenMax.mobileL} {
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
    url: 'https://discord.gg/sQCxgYs',
    name: i18n.t("links.support"),
    external: true,
    logged: true,
    guest: false
  },
]
