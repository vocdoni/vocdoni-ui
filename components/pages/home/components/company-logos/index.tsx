import React from 'react';
import styled from 'styled-components'
import { useTranslation } from 'react-i18next';

export const CompanyLogos = () => {
  const { i18n } = useTranslation()
  return (
    <LogosContainer>
      <SmallContainer>
        <img src='/images/home/company-logo/omnium.png' alt={i18n.t('home.omnium_logo_alt')} />
      </SmallContainer>

      <LogoContainer>
        <img src='/images/home/company-logo/pirates.png' alt={i18n.t('home.pirates_logo_alt')} />
      </LogoContainer>

      <LogoContainer>
        <img src='/images/home/company-logo/cec.png' alt={i18n.t('home.cec_logo_alt')} />
      </LogoContainer>

      <SmallContainer>
        <img src='/images/home/company-logo/fairbnb.png' alt={i18n.t('home.fairbnb_logo_alt')} />
      </SmallContainer>

      <SmallContainer>
        <img src='/images/home/company-logo/ticanoia.png' alt={i18n.t('home.ticanoia_logo_alt')} />
      </SmallContainer>
    </LogosContainer>
  )
}

const LogosContainer = styled.div`
  padding-top: 20px;
  text-align: center;
`
const LogoContainer = styled.div`
  width: 16%;
  padding: 10px 15px;
  display: inline-block;

  @media ${({ theme }) => theme.screenMax.tablet} {
    width: 40%;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    width: 80%;
    padding: 20px 0;
  }

  & > img {
    max-width: 100%;
    max-height: 36px;
    margin: auto;
  }
`
const SmallContainer = styled(LogoContainer)`

  & > img {
    max-width: 100%;
    max-height: 30px !important;
    margin: auto;
  }
`