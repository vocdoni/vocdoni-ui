import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { Grid, Column } from '@components/grid'
import { ImageContainer } from '@components/images'
import { SectionText, TextAlign } from '@components/text'
import { FlexJustifyContent } from '@components/flex'

import { AccountBackupPageCard } from '../components/page-card'

interface ISuccessCardProps {
  title: string,
  subtitle: string,
  text: string
}

export const SuccessCard = ({title, subtitle, text}: ISuccessCardProps) => (
  <AccountBackupPageCard
    title={title}
    subtitle={subtitle}
  >
    <Grid>
      <Column>
        <ImageContainer width="300px" justify={FlexJustifyContent.Center}>
          <img src="/images/entity/passphrase.png" />
        </ImageContainer>
      </Column>

      <Column>
        <TextContainer>
          <SectionText align={TextAlign.Center}>
            {text}
          </SectionText>
        </TextContainer>
      </Column>
    </Grid>
  </AccountBackupPageCard>
)

const TextContainer = styled.div`
  max-width: 400px;
  margin: auto;
`
