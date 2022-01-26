import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { Image } from '@components/elements/image'

import { useTheme } from '@hooks/use-theme'
import { colors } from '@theme/colors'

export const VoterFooter = () => {
  const { i18n } = useTranslation()
  const { theme } = useTheme()

  return (
    <FooterContainer></FooterContainer>
  )
}

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  height: 80px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (max-width: 1124px) {
    position: relative;
    margin-top: -80px;
  }
`

const VoterIconContainer = styled.div`
  width: 120px;
  max-height: 60px;
  margin-left: 20px;

  & > img {
    max-width: 120px;
    max-height: 60px;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    width: 100px;
    max-height: 50px;

    & > img {
      max-width: 100px;
      max-height: 50px;
    }
  }

  @media ${({ theme }) => theme.screenMax.mobileM} {
    width: 80px;
    max-height: 40px;

    & > img {
      max-width: 80px;
      max-height: 40px;
    }
  }

`
