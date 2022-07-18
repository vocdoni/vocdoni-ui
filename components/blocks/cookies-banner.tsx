import React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'

import { COOKIES_PATH } from '@const/routes'

import { Button } from '@components/elements/button'
import { Typography, TypographyVariant } from '@components/elements/typography'

import styled from 'styled-components'
import { sizes } from 'theme/sizes'
import { useCookies } from '@hooks/cookies'
import { If, Then } from 'react-if'
import { colors } from '@theme/colors'

export const CookiesBanner = () => {
  const { i18n } = useTranslation()
  const { acceptCookies, hide } = useCookies()

  return (
    <If condition={!hide}>
      <Then>
        <CookiesContainer>
          <CookiesBannerContent>
            <TextContainer>
              <SpacedContainer>
                <Typography variant={TypographyVariant.ExtraSmall}>
                  {i18n.t('cookies.cookies_paragraph_1')}{' '}
                  <FCBLink href={COOKIES_PATH}>{i18n.t('cookies.configure')}</FCBLink>
                </Typography>
              </SpacedContainer>
            </TextContainer>

            <ButtonsContainer>
              <ButtonContainer>
                <FCBButton positive onClick={acceptCookies} wide>
                  {i18n.t('cookies.accept')}
                </FCBButton>
              </ButtonContainer>

              <ConfigureButtonContainer>
                <Button fcb_border href={COOKIES_PATH} wide color="#2E377A">
                  {i18n.t('cookies.configure')}
                </Button>
              </ConfigureButtonContainer>
            </ButtonsContainer>
          </CookiesBannerContent>
        </CookiesContainer>
      </Then>
    </If>
  )
}

const FCBButton = styled(Button)`
  background: #CF122D !important;
`

const FCBLink = styled(Link)`
  color:#2E377A;
`

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
    margin-bottom: 0;
    width: 100%;
  }
`

const ConfigureButtonContainer = styled(ButtonContainer)`
@media ${({ theme }) => theme.screenMax.mobileL} {
  width: auto;
  margin-right: 16px;
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
