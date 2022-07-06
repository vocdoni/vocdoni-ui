import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { PageCardHeader } from '@components/elements/cards'
import { FALLBACK_VOTE_HEADER_IMAGE } from '@const/vote'
import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { Grid, Column } from '@components/elements/grid'

import { Image } from '../../elements/image'
import {
  Typography,
  TypographyVariant,
  TextAlign,
  H2,
  Body1,
} from '@components/elements/typography'
import { colors } from '@theme/colors'
import { Icon } from '@components/elements-v2/icons'

import { FCBEntityHeader } from '@components/pages/app/header/fcb-entity'

interface ICardImageHeader {
  title: string
  subtitle?: string
  entityImage?: string
  processImage?: string
  logged?: boolean
  onLogout?: () => void
}

export const CardImageHeader = ({
  title,
  subtitle,
  entityImage,
  processImage,
  logged,
  onLogout,
}: ICardImageHeader) => {
  const { i18n } = useTranslation()

  const headerImageSrc = processImage || FALLBACK_VOTE_HEADER_IMAGE
  //const entityImageSrc = entityImage || FALLBACK_ACCOUNT_ICON
  const entityImageSrc = '/images/app/fcb-logo.png'
  const ballotBoxIcon = '/images/app/fcb-header-icon.svg'
  const flagImg = '/images/app/fcb-header-flag.svg'

  return (
    <CardImageHeaderContainer>

      <HeaderMenu>
        <HeaderLangMenu>
          <FCBEntityHeader></FCBEntityHeader>
        </HeaderLangMenu>
        { logged && 
          <FCBLogout onClick={onLogout}>
            <Icon
              name='logout'
              size={18}
            />
          </FCBLogout>
        }
      </HeaderMenu>

      {/*
      <PageCardHeader>
          <Image
            src={headerImageSrc}
            alt={i18n.t('vote.vote_process_image_alt')}
          />
      </PageCardHeader>
      */}
      
      <PageCardHeader>
          <FixedImg>
            <img src={ballotBoxIcon} alt='FCB icon' width='48px' />
            <FCBH1>{i18n.t('fcb.process_title')}</FCBH1>
          </FixedImg>
          <FlagDiv>
            <img src={flagImg} alt='FCB flag' />
          </FlagDiv>          
      </PageCardHeader>
      

      <EntityLogoWrapper>
        <img src={entityImageSrc} alt="FCB Logo" />
      </EntityLogoWrapper>

      { false && 
        <Grid>
          <AbsoluteTitle>
            <CardH2 align={TextAlign.Center} margin="0 0 5px 0">
              {title}
            </CardH2>

            {subtitle && (
              <CardBody
                color={colors.accent1}
                align={TextAlign.Center}
                margin="0 0 20px 0"
              >
                {subtitle}
              </CardBody>
            )}
          </AbsoluteTitle>
        </Grid>
      }
    </CardImageHeaderContainer>
  )
}

const FlagDiv = styled.div`
  width: 40%;
  overflow: hidden;
  margin-top: -10px;
  height: 100vh;
`

const FixedImg = styled.div`
  width: 60%;
  margin-top: 20px;
  margin-left: 30px;
`

const FCBH1 = styled.h1`
  font-size: 30px;
  font-weight: 900;
  color: #154298;

  @media ${({ theme }) => theme.screenMin.tabletL} {
    font-size: 42px;
  } 

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 25px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    font-size: 22px;
  }
`

const FCBLogout = styled.div`
  background: 
    linear-gradient(#fff 0 0) padding-box, /*this is the white background*/
    linear-gradient(to right, #A50044, #174183) border-box;

  border: 2px solid transparent;
  border-radius: 8px;
  display: inline-block;
  position: relative;
  margin-left: 5px;
  top: 15px;
  padding: 9px;
  cursor: pointer;
  margin-top: -40px;

  @media ${({theme})  => theme.screenMax.mobileL } {
    padding: 11px;
    top: 20px;
    right: 15px;
  }
`

const HeaderMenu = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  margin: 0px 25px;
  height: 0px;
`

const HeaderLangMenu = styled.div`
  position: relative;
  top: 15px;
  width: 80px;
  margin-top: -40px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    right: 20px;
    top: 20px;
  }
`

const AbsoluteTitle = styled(Column)`
  position: absolute;
  top: 80px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    top: 10px;
    padding-left: 22px;
  }
`

const CardImageHeaderContainer = styled.div``

const CardH2 = styled(H2)`
  margin: 0 0 8px 0;
  color: #fff;
  font: Manrope;

  @media ${({ theme }) => theme.screenMax.laptopL} {
    font-size: 32px;
    line-height: 36px;
    font-weight: 600;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 24px;
    line-height: 28px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    text-align: left;
  }
`

const CardBody = styled(Body1)`
  color: #fff;
  font-weight: 600;
  font: Manrope;
  
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 16px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    text-align: left;
  }
`

const EntityLogoWrapper = styled.div`
  overflow: hidden;
  border-radius: 50%;
  width: 78px;
  height: 80px;
  display: flex;
  margin: -73px auto 0px;
  padding: 10px;

  & > img {
    max-height: 100%;
    max-width: 100%;
  }

  @media ${({ theme }) => theme.screenMax.tabletL} {
    margin-top: -58px;
    width: 58px;
    height: 60px;
  }
`
