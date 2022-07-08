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
        <Col xs={12} md={4} lg={2}>
          <CopyrightText>{i18n.t('fcb.copyright')}</CopyrightText>
        </Col>

        <Col xs={12} md={8} lg={4}>
          <Row gutter='none'>
            <Col sm={4} xs={3}>
              <ColoredLink href=''>{i18n.t('fcb.terms')}</ColoredLink>
            </Col>
            <Col sm={6} xs={9}>
              <ColoredLink href=''>{i18n.t('fcb.service_conditions')}</ColoredLink>
            </Col>
          </Row>
        </Col>
      
        <Col xs={12} lg={3}>
          <SupportDiv className='rightLg'>{i18n.t('fcb.voting_number')} <PhoneNumber>+34 851 000 065</PhoneNumber></SupportDiv>
        </Col>

        <Col xs={12} lg={3}>
          <SupportDiv>{i18n.t('fcb.support_number')} <PhoneNumber>+34 902 189 900</PhoneNumber></SupportDiv>
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
  color: #8D1A17;

  @media ${({ theme }) => theme.screenMax.laptopL} {
    margin-bottom: 20px;
    text-align: center;
    display: block;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    margin-bottom: 20px;
    margin-top: 0px;
    text-align: left;
    padding-left:10px;
  }
`

const SupportDiv = styled.div`
  display: block;
  font-weight: 600;
  color: #52606D;


  @media ${({ theme }) => theme.screenMin.desktop} {
    text-align: center;

    .rightLg{
      text-align: right !important;
      padding-right: 10px;
    }
  }

  @media ${({ theme }) => theme.screenMax.laptopL} {
    margin-top:10px;
    text-align: center;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    margin-bottom: 10px;
    margin-top: 10px;
    text-align: left;
    padding: 0px 10px;
  }
`

const PhoneNumber = styled.span`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 150%;
  margin-left: 8px;
  display: inline-block;
  color: #8D1A17;

  @media ${({ theme }) => theme.screenMax.laptopL} {
    margin-top:10px;
    text-align: center;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    text-align:left;
    margin-left: 0px;
    margin-top:5px;
    width:100%;
  }
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
  font-weight: 600;
  color: #52606D;

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 12px;
    margin-bottom: 10px;
    text-align: left;
    padding-left: 10px;
  }
`

const FooterContainer = styled.div`
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding-top:20px;
  padding-bottom:20px;
`
