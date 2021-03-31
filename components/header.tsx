import React, { useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'
// import Hamburger from 'hamburger-react'
import { useIsMobile } from '../hooks/use-window-size'

const HeaderContainer = styled.div`
  width: 100%;
  z-index: 100;
  min-height: 50px;
  position: fixed;
  top: 0;
  padding: 10px 0 10px;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.accent1} 0%,
    ${({ theme }) => theme.accent2} 100%
  );

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
  width: 100%;
  justify-content: space-between;
  align-items: center;
`

const MenuItemsContainer = styled.div`
  display: flex;
  justify-content: center;
`

const ListItem = styled.div`
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }
`

const VocdoniLink = styled.a`
  font-weight: 500;
  color: ${({ theme }) => theme.white};
  text-decoration: none;
  cursor: pointer;
`

const ClickableLink = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.white};
`

const MobileMenuContainer = styled.div<{ showMenu: boolean }>`
  position: fixed;
  padding: 0;
  margin: 0;
  top: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.white};
  z-index: 10;
  margin-top: 70px;

  -webkit-transition: top 0.5s ease-in-out;
  -moz-transition: top 0.5s ease-in-out;
  -o-transition: top 0.5s ease-in-out;
  transition: top 0.5s ease-in-out;

  @media ${({ theme }) => theme.screenMin.tablet} {
    top: ${({ showMenu }) => (showMenu ? '0' : '-100%')};
  }
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
  header?: boolean;
  footer?: boolean;
}

export const LINKS: HeaderLink[] = [
  {
    url: '/tokens',
    name: 'Find Tokens',
    header: true,
  },
  {
    url: 'https://blog.vocdoni.io',
    name: 'Blog',
    external: true,
    header: true,
  },
  {
    url: 'https://docs.vocdoni.io',
    name: 'Docs',
    external: true,
    header: true,
  },
  {
    url: 'https://discord.gg/sQCxgYs',
    name: 'Discord',
    external: true,
    header: true,
    footer: true,
  },
  {
    url: 'https://twitter.com/vocdoni',
    name: 'Twitter',
    external: true,
    footer: true,
  },
  {
    url: 'https://t.me/vocdoni',
    name: 'Telegram',
    external: true,
    footer: true,
  },
]

const LinkItem = ({
  name,
  url,
  external,
  onClick,
}: HeaderLink & React.HTMLProps<HTMLAnchorElement>) => (
  <ListItem>
    <Link href={url} passHref>
      <ClickableLink
        onClick={onClick}
        target={external ? '_blank' : '_self'}
      >
        {name}
      </ClickableLink>
    </Link>
  </ListItem>
)

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const isMobile = useIsMobile()
  const HEADER_LINKS = LINKS.filter((l) => l.header)

  return (
    <>
      {isMobile && (
        <MobileMenuContainer showMenu={showMenu}>
          {LINKS.map((link) => (
            <LinkItem
              {...link}
              key={link.name}
              onClick={() => setShowMenu(false)}
            />
          ))}
          <Section>Vocdoni {new Date().getFullYear()}</Section>
        </MobileMenuContainer>
      )}
      <HeaderContainer>
        <ListContainer>
          <Link href='/' passHref>
            <VocdoniLink target='_self'>Vocdoni</VocdoniLink>
          </Link>
          <MenuItemsContainer>
            {!isMobile &&
              HEADER_LINKS.map((link) => (
                <LinkItem {...link} key={link.name} />
              ))}
          </MenuItemsContainer>
        </ListContainer>
      </HeaderContainer>
    </>
  )
}
