import React from 'react'
import styled, { useTheme } from 'styled-components'
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

interface ICardImageHeader {
  title: string
  subtitle?: string
  entityImage?: string
  processImage?: string
}

export const CardImageHeader = ({
  title,
  subtitle,
  entityImage,
  processImage,
}: ICardImageHeader) => {
  const { i18n } = useTranslation()
  const { accent1 } = useTheme()

  const headerImageSrc = processImage || FALLBACK_VOTE_HEADER_IMAGE
  const entityImageSrc = entityImage || FALLBACK_ACCOUNT_ICON

  return (
    <CardImageHeaderContainer>
      { false && (
        <EntityLogoWrapper>
          <Image src={entityImageSrc} alt={i18n.t('vote.entity_logo_alt')} />
        </EntityLogoWrapper>
      )}

      <PageCardHeader>
        <Image
          src={headerImageSrc}
          alt={i18n.t('vote.vote_process_image_alt')}
        />
      </PageCardHeader>
    
      <EntityLogoWrapper>
        <Image src={entityImageSrc} alt={i18n.t('vote.entity_logo_alt')} />
      </EntityLogoWrapper>
      
      <Grid>
        <Column>
          <CardH2 align={TextAlign.Center} margin="0 0 5px 0">
            {title}
          </CardH2>
        </Column>
      </Grid>
    </CardImageHeaderContainer>
  )
}

const CardImageHeaderContainer = styled.div``

const CardH2 = styled(H2)`
  margin: 0 0 8px 0;
  font-size: 32px;
  line-heihgt: 44px;
  font-weight: 400;


  @media ${({ theme }) => theme.screenMax.tabletL} {
    font-size: 28px;
    line-height: 36px;
  }

  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 18px;
    line-height: 26px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    font-size: 16px;
    line-heihgt: 22px;
    font-weight: 600;
  }
`

const CardBody = styled(Body1)`
  @media ${({ theme }) => theme.screenMax.tablet} {
    font-size: 16px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    text-align: left;
  }
`

const EntityLogoWrapper = styled.div`
  overflow: hidden;
  height: 84px;
  display: flex;
  margin: -72px auto 0px;
  border: solid 1px ${({ theme }) => theme.white};
  margin-bottom:40px;
  text-align: center;
  display: block;

  & > img {
    max-height: 100%;
    max-width: 100%;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin-left: 0;
  }
`
