import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { Grid, Column } from '@components/grid'
import { ImageContainer } from '@components/images'
import { SectionText, TextAlign } from '@components/text'
import { FlexContainer, FlexJustifyContent } from '@components/flex'

import { AccountBackupPageCard } from '../components/page-card'
import { Button } from '@components/button'
import { DASHBOARD_PATH } from '@const/routes'

interface ISuccessCardProps {
  title: string
  subtitle: string
  text: string
}

export const SuccessCard = ({ title, subtitle, text }: ISuccessCardProps) => (
  <AccountBackupPageCard title={title} subtitle={subtitle}>
    <Grid>
      <Column>
        <ImageContainer width="300px" justify={FlexJustifyContent.Center}>
          <img src="/images/entity/passphrase.png" />
        </ImageContainer>
      </Column>

      <Column>
        <TextContainer>
          <SectionText align={TextAlign.Center}>{text}</SectionText>
        </TextContainer>
      </Column>

      <Column>
        <FlexContainer justify={FlexJustifyContent.Center}>
          <Button positive href={DASHBOARD_PATH}>
            {i18n.t('entity.go_to_the_dashboard')}
          </Button>
        </FlexContainer>
      </Column>
    </Grid>
  </AccountBackupPageCard>
)

const TextContainer = styled.div`
  max-width: 400px;
  margin: 20px auto 40px;
`
