import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

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
      <CenterRow gutter='none' align='center'>
        <Col xs='3'>
          <Typography variant={TypographyVariant.ExtraSmall} color={colors.lightText}>
            {i18n.t('app.footer.powered_by')}
          </Typography>
        </Col>

        <Col xs='5'>
          <VoterIconContainer>
            {theme.customLogo ? (
              <Image src={theme.customLogo} />
            ) : (
              <img src="/images/app/logo-mid.svg" alt="Vocdoni" />
            )}
          </VoterIconContainer>
        </Col>
      </CenterRow>
    </FooterContainer>
  )
}

const CenterRow = styled(Row)`
  justify-content: center;
`

const FooterContainer = styled.div`
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.white};
  display: flex;
  padding: 30px 0px;
  box-shadow: 0 -5px 5px -5px rgba(180,193,228,0.25);
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
