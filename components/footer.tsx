import React from 'react'
import styled, { useTheme } from 'styled-components'
import Link from 'next/link'

import { LINKS } from './header'

const Container = styled.div`
  padding: 30px 0 30px;
  font-size: 13px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const Section = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 40px 40px 0;
  color: ${({ color }) => color};
`

const ClickableText = styled.a`
  text-decoration: underline;
  color: ${({ theme }) => theme.lightText};
`

export const Footer = () => {
  const theme = useTheme()
  const FOOTER_LINKS = LINKS.filter((l) => l.footer)

  return <Container>
    <Section>
      {FOOTER_LINKS.map(({ url, name }, i) => (
        <div key={name}>
          <Link href={url} passHref>
            <ClickableText target='_blank'>
              {name}
            </ClickableText>
          </Link>
          {i < FOOTER_LINKS.length - 1 ? ' · ' : null}
        </div>
      ))}
    </Section>
    <Section color={theme.lightText}>
      Vocdoni {new Date().getFullYear()}
    </Section>
  </Container>
}
