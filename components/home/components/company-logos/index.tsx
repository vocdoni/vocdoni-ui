import React from 'react';
import styled from 'styled-components'
import { Column, Grid } from '@components/grid';
import i18n from '@i18n';

export const CompanyLogos = () => (
  <LogosContainer>
      <LogoContainer>
        <img src='/images/home/company-logo/omnium.png' alt={i18n.t('home.omnium_logo_alt')} />
      </LogoContainer>
 
      <LogoContainer>
        <img src='/images/home/company-logo/pirates.png' alt={i18n.t('home.pirates_logo_alt')} />
      </LogoContainer>

      <LogoContainer>
        <img src='/images/home/company-logo/cec.png' alt={i18n.t('home.cec_logo_alt')} />
      </LogoContainer>

      <LogoContainer>
        <img src='/images/home/company-logo/fairbnb.png' alt={i18n.t('home.fairbnb_logo_alt')} />
      </LogoContainer>

      <LogoContainer>
        <img src='/images/home/company-logo/ticanoia.png' alt={i18n.t('home.ticanoia_logo_alt')} />
      </LogoContainer>
  </LogosContainer>
)

const LogosContainer = styled.div`
  display: flex;
`
const LogoContainer = styled.div`
  width: 20%;
  padding: 10px 15px;

  @media ${({theme})  => theme.screenMax.tabletL } {
    width: 30%;
  }

  & > img {
    max-width: 100%;
    max-height: 40px;
    margin: auto;
  }
`