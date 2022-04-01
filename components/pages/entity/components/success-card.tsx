import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { Grid, Column } from '@components/elements/grid'
import { ImageContainer } from '@components/elements/images'
import { SectionText, TextAlign } from '@components/elements/text'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'

import { AccountBackupPageCard } from './page-card'
import { Button } from '@components/elements/button'
import { DASHBOARD_PATH } from '@const/routes'

interface ISuccessCardProps {
  title: string
  subtitle: string
  text: string
}

export const SuccessCard = ({ title, subtitle, text }: ISuccessCardProps) => {
  const { i18n } = useTranslation()

  return (
    <AccountBackupPageCard title={title} subtitle={subtitle}>
      <Grid>
        <Column>
          <ImageContainer width="300px" justify={FlexJustifyContent.Center}>
            <img src="/images/entity/passphrase.jpg" />
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
}

const TextContainer = styled.div`
  max-width: 400px;
  margin: 20px auto 40px;
`
