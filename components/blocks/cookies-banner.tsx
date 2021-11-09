import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { COOKIES_PATH } from '@const/routes'

import { BaseButton, Button } from '@components/elements/button'
import { Typography, TypographyVariant } from '@components/elements/typography'

import styled from 'styled-components'
import { sizes } from 'theme/sizes'
import { useCookies } from '@hooks/cookies'
import { If } from 'react-if'
import { colors } from '@theme/colors'

export const CookiesBanner = () => {
  const { i18n } = useTranslation()
  const { acceptCookies, hide } = useCookies()

  return (
    <If condition={!hide}>
      <CookiesContainer>
        <CookiesBannerContent>
          <TextContainer>
            <SpacedContainer>
              <Typography variant={TypographyVariant.ExtraSmall}>
                {i18n.t('cookies.cookies_paragraph_1')}{' '}
                <Link href={COOKIES_PATH}>{i18n.t('cookies.configure')}</Link>
              </Typography>
            </SpacedContainer>
          </TextContainer>

          <ButtonsContainer>
            <ButtonContainer>
              <Button positive onClick={acceptCookies} wide>
                {i18n.t('cookies.accept')}
              </Button>
            </ButtonContainer>

            <ButtonContainer>
              <Button border href={COOKIES_PATH} wide color={colors.accent1}>
                {i18n.t('cookies.configure')}
              </Button>
            </ButtonContainer>
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

  @media ${({ theme }) => theme.screenMax.mobileL} {
    p,
    a {
      font-size: 10px;
    }
  }
`
const ButtonsContainer = styled.div`
  min-width: 120px;
  padding: 10px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 0px;

    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
  }
`
const ButtonContainer = styled.div`
  margin-bottom: 12px;
  @media ${({ theme }) => theme.screenMax.mobileL} {
    width: 48%;
    margin-bottom: 0;
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
  z-index: 200;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.white};

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    backdrop-filter: blur(40px);
    background-color: transparent;
  }
`
