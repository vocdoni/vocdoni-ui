import React from 'react'
import Link from 'next/link'
// import { useTranslation } from 'react-i18next'
import i18n from '@i18n'
import { COOKIES_PATH, VOTING_PATH } from '@const/routes'

import { Button } from '@components/elements/button'
import { Typography, TypographyVariant } from '@components/elements/typography'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'

import styled from 'styled-components'
import { sizes } from 'theme/sizes'
import { useCookies } from '@hooks/cookies'
import { If } from 'react-if'

export const CookiesBanner = () => {
  // const { i18n } = useTranslation()

  const { acceptCookies, rejectCookies, accepted, hide } = useCookies()

  const showCookiesBanner = !accepted && !hide
  return (
    <If condition={showCookiesBanner}>
      <CookiesContainer>
        <TextContainer>
          <FlexContainer
            alignItem={FlexAlignItem.Center}
            justify={FlexJustifyContent.SpaceAround}
          >
            <SpacedContainer>
              <Typography variant={TypographyVariant.ExtraSmall}>
                {i18n.t('cookies.cookies_paragraph_1')}
              </Typography>

              <Typography variant={TypographyVariant.ExtraSmall}>
                {i18n.t('cookies.cookies_paragraph_2')}{' '}
                <Link href={COOKIES_PATH}>
                  {i18n.t('cookies.more_details')}
                </Link>
              </Typography>
            </SpacedContainer>

            <SpacedContainer>
              <Button positive onClick={acceptCookies}>
                {i18n.t('cookies.accept')}
              </Button>
            </SpacedContainer>

            <SpacedContainer>
              <Button border onClick={rejectCookies}>
                {i18n.t('cookies.reject')}
              </Button>
            </SpacedContainer>
          </FlexContainer>
        </TextContainer>
      </CookiesContainer>
    </If>
  )
}

const TextContainer = styled.div`
  max-width: ${sizes.laptopL * 0.8}px;
  margin: auto;

  & > div > div {
    padding-right: 10px;
  }
`
const SpacedContainer = styled.div`
  margin-left: 14px;
`

const CookiesContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  padding: 10px 0;
  background-color: ${({ theme }) => theme.white};
`
