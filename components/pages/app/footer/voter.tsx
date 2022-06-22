import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { Image } from '@components/elements/image'
import { Col, Row } from '@components/elements-v2/grid'

import { useTheme } from '@hooks/use-theme'
import { colors } from '@theme/colors'

export const VoterFooter = () => {
  const { i18n } = useTranslation()
  const { theme } = useTheme()

  return (
    <FooterContainer>
      <Row gutter='none'>
        <Col xs={12} md={4}>
          <CopyrightText>{i18n.t('fcb.copyright')}</CopyrightText>
        </Col>

        <Col xs={12} md={8}>
          <Row>
            <Col xs={12} md={2}>
              <ColoredLink href=''>{i18n.t('fcb.terms')}</ColoredLink>
            </Col>

            <Col xs={12} md={4}>
              <ColoredLink href=''>{i18n.t('fcb.service_conditions')}</ColoredLink>
            </Col>

            <Col xs={12} md={6}>
              <SupportDiv>{i18n.t('fcb.support_number')} <PhoneNumber>+34 999 999 999</PhoneNumber></SupportDiv>
            </Col>
          </Row>
        </Col>
      </Row>
    </FooterContainer>
  )
}

const ColoredLink = styled.a`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;

  /* FCB-grad */
  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  display: inline;
`

const SupportDiv = styled.div`
  display: inline;
  text-align: center;
`

const PhoneNumber = styled.span`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  margin-left: 8px;
  display: inline;

  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CopyrightText = styled.div`
  font-family: Manrope;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0em;
  text-align: center;
  display: inline-block;
  width: 100%;

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 12px;
    margin-bottom: 10px;
  }
`

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding-top:20px;
  padding-bottom:20px;

  @media (max-width: 1124px) {
    position: relative;
    text-align: center;
  }
`

const VoterIconContainer = styled.div`
  width: 160px;
  max-height: 80px;
  margin-left: 20px;

  & > img {
    max-width: 160px;
    max-height: 80px;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    width: 120px;
    max-height: 70px;

    & > img {
      max-width: 120px;
      max-height: 70px;
    }
  }

  @media ${({ theme }) => theme.screenMax.mobileM} {
    width: 100px;
    max-height: 60px;

    & > img {
      max-width: 100px;
      max-height: 60px;
    }
  }

`
