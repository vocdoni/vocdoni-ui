import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { SectionText, SectionTitle, TextAlign } from '@components/elements/text'
import { PageCardHeader } from '@components/elements/cards'
import { FALLBACK_VOTE_HEADER_IMAGE } from '@const/vote'
import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { Grid , Column} from '@components/elements/grid'

import { Image } from '../../elements/image'

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
  const headerImageSrc = processImage || FALLBACK_VOTE_HEADER_IMAGE
  const entityImageSrc = entityImage || FALLBACK_ACCOUNT_ICON

  return (
    <CardImageHeaderContainer>
      <PageCardHeader>
        <Image src={headerImageSrc} alt={i18n.t('vote.vote_process_image_alt')} />
      </PageCardHeader>

      <EntityLogoWrapper>
        <Image src={entityImageSrc} alt={i18n.t('vote.entity_logo_alt')} />
      </EntityLogoWrapper>

      <Grid>
        
        <Column>
          <SectionTitle align={TextAlign.Center}>{title}</SectionTitle>
          {
            subtitle && (
              <SectionText align={TextAlign.Center} color='accent1'>
                {subtitle}
              </SectionText>
            )}
        </Column>
      </Grid>
    </CardImageHeaderContainer>
  )
}

const CardImageHeaderContainer = styled.div`
`

const EntityLogoWrapper = styled.div`
  overflow: hidden;
  border-radius: 50%;
  width: 130px;
  height: 130px;
  display: flex;
  margin: -90px auto 10px;
  border: solid 1px ${({ theme }) => theme.white};

  & > img {
    max-height: 100%;
    max-width: 100%;
  }
`
