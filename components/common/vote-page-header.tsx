import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { SectionText, SectionTitle, TextAlign } from '@components/text'
import { PageCardHeader } from '@components/cards'
import { FALLBACK_VOTE_HEADER_IMAGE } from '@const/vote'
import { FALLBACK_ACCOUNT_ICON } from '@const/account'
import { Grid , Column} from '@components/grid'
import { colors } from 'theme/colors'

import { Image } from './image'

interface IVotePageHeader {
  processTitle: string
  entityName?: string
  entityImage?: string
  processImage?: string
}

export const VotePageHeader = ({
  processTitle,
  entityName,
  entityImage,
  processImage,
}: IVotePageHeader) => {
  const headerImageSrc = processImage || FALLBACK_VOTE_HEADER_IMAGE
  const entityImageSrc = entityImage || FALLBACK_ACCOUNT_ICON

  return (
    <VotePageHeaderContainer>
      <PageCardHeader>
        <Image src={headerImageSrc} alt={i18n.t('vote.vote_process_image_alt')} />
      </PageCardHeader>

      <EntityLogoWrapper>
        <Image src={entityImageSrc} alt={i18n.t('vote.entity_logo_alt')} />
      </EntityLogoWrapper>

      <Grid>
        
        <Column>
          <SectionTitle align={TextAlign.Center}>{processTitle}</SectionTitle>
          <SectionText align={TextAlign.Center} color={colors.accent1}>
            {entityName || i18n.t('vote.login_with_your_credentials_to_access_the_process')}
          </SectionText>
        </Column>
      </Grid>
    </VotePageHeaderContainer>
  )
}

const VotePageHeaderContainer = styled.div`
`

const EntityLogoWrapper = styled.div`
  overflow: hidden;
  border-radius: 50%;
  width: 100px;
  height: 100px;
  margin: -75px auto 10px;
  border: solid 1px ${({ theme }) => theme.white};

  & > img {
    width: 100px;
    height: 100px;
  }
`
