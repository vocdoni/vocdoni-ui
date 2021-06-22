import React from 'react'
import styled from 'styled-components'

import { Typography, TypographyVariant } from '@components/elements/typography'
import i18n from '@i18n'
import { colors } from 'theme/colors'

import { Button } from '@components/elements/button'
import { sizes } from 'theme/sizes'
import { CREATE_ACCOUNT_PATH } from '@const/routes'

export const HeroBanner = () => (
  <BannerContainer>
    <ContentContainer>
      <LeftContainer>
        <Title>
          <strong>{i18n.t('home.easy_and_secure')}</strong>{' '}
          {i18n.t('home.for_all_your_governance')}
        </Title>

        <ActionContainer>
          <ButtonContainer>
            <Button positive href={CREATE_ACCOUNT_PATH}>
              {i18n.t('home.try_it_for_free')}
            </Button>
          </ButtonContainer>

          <Typography variant={TypographyVariant.Small} color={colors.accent1}>
            {i18n.t('home.free_until_15_october')}
          </Typography>
        </ActionContainer>
      </LeftContainer>
    </ContentContainer>
    <RightContainer>
      <PhoneContainer>
        <img
          src="/images/home/banner/phone.png"
          alt={i18n.t('home.device_with_vocdoni_alt')}
        />
      </PhoneContainer>

      <ComputerContainer>
        <img
          src="/images/home/banner/pc.png"
          alt={i18n.t('home.computer_with_vocdoni_alt')}
        />
      </ComputerContainer>
    </RightContainer>
  </BannerContainer>
)

const BannerContainer = styled.div`
  height: 530px;
  margin-top: -50px;
  width: 100%;
  overflow: hidden;
  position: relative;

  background: linear-gradient(136.49deg, #f0ffde 20.98%, #e0ffff 73.1%);

  @media ${({ theme }) => theme.screenMax.tablet} {
    height: auto;
  }

  // @media ${({ theme }) => theme.screenMax.tabletL} {
  //   height: auto;
  // }
`
const AbsoluteContent = styled.div`
  height: 500px;
  position: absolute;
  overflow: hidden;
  z-index: -2;
  left: 0;
  right: 0;

  @media ${({ theme }) => theme.screenMax.tablet} {
    height: 420px;
  }

  @media ${({ theme }) => theme.screenMax.tabletL} {
    position: relative;
    margin: 0 -10px;
    height: auto;
  }
`

const ContentContainer = styled.div`
  padding: ${({ theme }) => theme.margins.mobile.horizontal};
  max-width: ${sizes.laptopL * 0.8}px;
  height: 100%;
  margin: auto;
  display: flex;
  align-items: center;
`

const ButtonContainer = styled.div`
  margin-right: 10px;
`
const RightContainer = styled.div`
  position: absolute;
  top: 60px;
  left: 60%;
  width: 47%;
  max-width: 700px;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    position: absolute;
    left: 80%;
    top: 100px;
  }

  @media ${({ theme }) => theme.screenMax.mobileM} {
    display: none;
  }
`

const LeftContainer = styled.div`
  width: 50%;
  float: left;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    width: 60%;
    padding: 40px 0;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    width: 80%;
    padding: 40px 0;
  }

  @media ${({ theme }) => theme.screenMax.mobileM} {
    width: 100%;
    text-align: center;
  }
`

const PhoneContainer = styled.div`
  width: 24%;
  position: absolute;
  z-index: 1;

  & > img {
    width: 100%;
  }
`
const ComputerContainer = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;

  & > img {
    width: 100%;
  }
`

const ActionContainer = styled.div`
  display: flex;
  align-items: center;

  @media ${({ theme }) => theme.screenMax.mobileM} {
    flex-direction: column;
  }
`
const Title = styled.h1`
  color: ${({ theme }) => theme.blueText};
  margin-bottom: 30px;
  font-size: 50px;
  font-weight: 400;

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 40px;
  }

  @media ${({ theme }) => theme.screenMax.mobileM} {
    font-size: 24px;
  }
`
