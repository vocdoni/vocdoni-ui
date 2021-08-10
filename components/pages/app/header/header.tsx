import React, { MouseEvent, ReactNode, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { Unless } from 'react-if'

import { DASHBOARD_PATH } from '@const/routes'

import { MenuIcon } from '@components/blocks/menu-icon'
import { useIsMobile } from '@hooks/use-window-size'

import { sizes } from '../../../../theme/sizes'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'


interface IHeaderProps {
  hasReadyAccount: boolean
  children?: ReactNode
}

export const Header = ({ hasReadyAccount, children }: IHeaderProps) => {
  const isMobile = useIsMobile()
  const { i18n } = useTranslation()
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

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

  const links = hasReadyAccount ? LINKS.filter(link => link.logged) : LINKS.filter(link => link.guest)

  return (
    <>
      <HeaderContainer>
        <ListContainer>
          <Link href={hasReadyAccount ? DASHBOARD_PATH : "/"} passHref>
            <HomeLink target='_self'><img src="/media/logo-full.svg" alt="Vocdoni" /></HomeLink>
          </Link>

          <MenuItemsContainer>
            <Unless condition={isMobile}>
              {links.map((link) => (
                <LinkItem {...link} key={link.name}>{link.name}</LinkItem>
              ))}
            </Unless>
          </MenuItemsContainer>
        </ListContainer>

        <MobileMenuContainer showMenu={openMobileMenu}>
          {links.map((link) => (
            <MenuItem key={link.name}>
              <LinkItem
                {...link}
                onClick={() => setOpenMobileMenu(false)}
              >
                <Typography variant={TypographyVariant.Subtitle1}>{link.name}</Typography>
              </LinkItem>
            </MenuItem>
          ))}
          <MobileMenuActionsContainer onClick={() => setOpenMobileMenu(false)}>{children}</MobileMenuActionsContainer>
        </MobileMenuContainer>

        {isMobile && <MenuIcon menuState={openMobileMenu} onClickMenu={setOpenMobileMenu} />}

        {!isMobile && (
          <RightContainer>
            {children}
          </RightContainer>
        )}
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

  @media ${({ theme }) => theme.screenMax.mobileL} {
    display: none;
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
const MobileMenuActionsContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  padding: 20px;
  
  & > a {
    width: 100%;
  }
`
const MobileMenuContainer = styled.div<{ showMenu: boolean, }>`
  display: none;
  background: linear-gradient(180deg, #f0ffde 20.98%,#e0ffff 73.1%);
  position: fixed;
  width: 100%;
  top: 0;
  overflow: hidden;
  height: 0;
  z-index: -1;

  @media ${({ theme }) => theme.screenMax.tablet} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    visibility: ${({ showMenu }) => showMenu ? 'visible' : 'hidden'};
    height: ${({ showMenu }) => showMenu ? '100vh' : '0'};;
    top: ${({ showMenu }) => showMenu ? '0' : '-100%'};
  
    -webkit-transition: all  0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
  }
`

const MenuItem = styled.div`
  color: ${({ theme }) => theme.blueText};
`

const Section = styled.div`
  display: flex;
  margin-top: 30px;
  justify-content: center;
  color: ${({ color }) => color};
`

interface HeaderLink {
  name: string;
  url: string;
  external?: boolean;
  logged?: boolean;
  guest?: boolean;
}

interface ILinkItemProps {
  url: string;
  children: ReactNode;
  external?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const LinkItem = ({
  url,
  external,
  onClick,
  children
}: ILinkItemProps) => (
  <ListItem>
    <Link href={url} passHref>
      <a
        onClick={onClick}
        target={external ? '_blank' : '_self'}
      >
        {children}
      </a>
    </Link>
  </ListItem>
)
