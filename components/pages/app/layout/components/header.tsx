import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Else, If, Then, Unless } from 'react-if'

import i18n from '@i18n'

import { DASHBOARD_PATH } from '@const/routes'

import { hexToRgbA } from '@lib/util'

import { useIsMobile } from '@hooks/use-window-size'

import { sizes } from '../../../../../theme/sizes'

export const LINKS: HeaderLink[] = [
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
    // url: ABOUT_PATH,
    url: "https://vocdoni.io",
    name: i18n.t("links.about"),
    external: false,
    logged: false,
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
    url: 'https://discord.gg/sQCxgYs',
    name: i18n.t("links.support"),
    external: true,
    logged: false,
    guest: false
  },
]

interface IHeaderProps {
  hasReadyAccount: boolean
  children?: ReactNode
}

export const Header = ({hasReadyAccount, children}: IHeaderProps) => {
  const isMobile = useIsMobile()


  const links = hasReadyAccount ? LINKS.filter(link => link.logged) : LINKS.filter(link => link.guest)

  return (
    <>
      {/* {isMobile && (
        <MobileMenuContainer showMenu={showMenu}>
          {links.map((link) => (
            <LinkItem
              {...link}
              key={link.name}
              onClick={() => setShowMenu(false)}
            />
          ))}
          <Section>Vocdoni {new Date().getFullYear()}</Section>
        </MobileMenuContainer>
      )} */}
      <HeaderContainer>
        <ListContainer>
          <Link href={hasReadyAccount ? DASHBOARD_PATH : "/"} passHref>
            <HomeLink target='_self'><img src="/media/logo-full.svg" alt="Vocdoni" /></HomeLink>
          </Link>
          <MenuItemsContainer>
            <Unless condition={isMobile}>
              {links.map((link) => (
                <LinkItem {...link} key={link.name} />
              ))}
            </Unless>
          </MenuItemsContainer>
        </ListContainer>
        <RightContainer>
          { children }
        </RightContainer>
      </HeaderContainer>
    </>
  )
}

const HeaderContainer = styled.div`
  width: 100%;
  z-index: 100;
  min-height: 50px;
  position: fixed;
  top: 0;
  padding: 10px 0 10px;

  background-color: ${({ theme }) => hexToRgbA(theme.background, 0.7)};
  backdrop-filter: blur(10px);

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  font-size: 16px;

  & a {
    font-size: 16px;
  }
`

const ListContainer = styled.div`
  padding: 0 20px;
  display: flex;
  // width: 100%;
  justify-content: flex-start;
  align-items: center;

  max-width: ${sizes.laptopL * 0.8}px;

  @media ${({ theme }) => theme.screenMin.tablet} {
    padding: 0 ${({ theme }) => theme.margins.desktop.horizontal};
  }
`

const RightContainer = styled.div`
padding: 0 ${({ theme }) => theme.margins.mobile.horizontal};

@media ${({ theme }) => theme.screenMin.tablet} {
  padding: 0 ${({ theme }) => theme.margins.desktop.horizontal};
}
`

const MenuItemsContainer = styled.div`
  margin-left: 20px;
  display: flex;
  justify-content: center;
`

const ListItem = styled.div`
  margin: 0 16px;

  a {
    color: ${({ theme }) => theme.text}
  }
`

const HomeLink = styled.a`
  cursor: pointer;

  & > img {
    margin-top: 6px;
    height: 45px;
  }
`

// const MobileMenuContainer = styled.div<{ showMenu: boolean }>`
//   position: fixed;
//   padding: 0;
//   margin: 0;
//   top: -100%;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: ${({ theme }) => theme.white};
//   z-index: 10;
//   margin-top: 70px;

//   -webkit-transition: top 0.5s ease-in-out;
//   -moz-transition: top 0.5s ease-in-out;
//   -o-transition: top 0.5s ease-in-out;
//   transition: top 0.5s ease-in-out;

//   @media ${({ theme }) => theme.screenMin.tablet} {
//     top: ${({ showMenu }) => (showMenu ? '0' : '-100%')};
//   }
// `

// const Section = styled.div`
//   display: flex;
//   margin-top: 30px;
//   justify-content: center;
//   color: ${({ color }) => color};
// `

interface HeaderLink {
  name: string;
  url: string;
  external?: boolean;
  logged?: boolean;
  guest?: boolean;
}

const LinkItem = ({
  name,
  url,
  external,
  onClick,
}: HeaderLink & React.HTMLProps<HTMLAnchorElement>) => (
  <ListItem>
    <Link href={url} passHref>
      <a
        onClick={onClick}
        target={external ? '_blank' : '_self'}
      >
        {name}
      </a>
    </Link>
  </ListItem>
)