import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { COOKIES_PATH } from '@const/routes'

import { Button } from '@components/elements/button'
import { Typography, TypographyVariant } from '@components/elements/typography'

import styled from 'styled-components'
import { sizes } from 'theme/sizes'
import { useCookies } from '@hooks/cookies'
import { If } from 'react-if'

export const CookiesBanner = () => {
  const { i18n } = useTranslation()

  const { acceptCookies, rejectCookies, accepted, hide } = useCookies()

  const showCookiesBanner = !accepted && !hide
  return (
    <If condition={showCookiesBanner}>
      <CookiesContainer>
        <CookiesBannerContent>
          <TextContainer>
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
          </TextContainer>

          <ButtonsContainer>
            <SpacedContainer>
              <Button positive onClick={acceptCookies} wide>
                {i18n.t('cookies.accept')}
              </Button>
            </SpacedContainer>

            <SpacedContainer>
              <Button border onClick={rejectCookies} wide>
                {i18n.t('cookies.reject')}
              </Button>
            </SpacedContainer>
          </ButtonsContainer>
        </CookiesBannerContent>
      </CookiesContainer>
    </If>
  )
}

const CookiesBannerContent = styled.div`
  display: flex;
  flex-direction: row;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    flex-direction: column;
  }
`
const TextContainer = styled.div`
  max-width: ${sizes.laptopL * 0.8}px;
  margin: auto;

  & > div > div {
    padding-right: 10px;
  }
`
const ButtonsContainer = styled.div`
  min-width: 120px;
  padding: 10px;

  @media ${({ theme }) => theme.screenMax.mobileM} {
    padding: 0;
  }
`

const SpacedContainer = styled.div`
  margin-bottom: 12px;
`

const CookiesContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.white};
`
