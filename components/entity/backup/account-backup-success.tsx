import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { Grid, Column } from '@components/grid'
import { ImageContainer } from '@components/images'
import { SectionText, TextAlign } from '@components/text'
import { FlexJustifyContent } from '@components/flex'

import { AccountBackupPageCard } from './components/page-card'

export const AccountBackupSuccess = () => (
  <AccountBackupPageCard>
    <Grid>
      <Column>
        <ImageContainer width="400px" justify={FlexJustifyContent.Center}>
          <img src="/images/entity/passphrase.png" />
        </ImageContainer>
      </Column>

      <Column>
        <TextContainer>
          <SectionText align={TextAlign.Center}>
            {i18n.t(
              'entity.your_account_is_protected_now_store_these_file_in_a_secure_place'
            )}
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
