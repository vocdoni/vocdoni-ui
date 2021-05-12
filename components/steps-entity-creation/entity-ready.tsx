import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'
import { colors } from '../../theme/colors'

import { CREATE_PROCESS_PATH, DASHBOARD_PATH, VOTING_AUTH_FORM_PATH } from '@const/routes'

import { useProcessCreation } from '@hooks/process-creation'

import { SectionText, SectionTitle, TextAlign } from '@components/text'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { ImageContainer } from '@components/images'
import { Button } from '@components/button'

export const EntityReady = () => {
  const { processId } = useProcessCreation()

  return (
    <ProcessReadyContainer>
      <ImageContainer width="500px" justify={FlexJustifyContent.Center}>
        <img src="/images/entity/create-entity.png" />
      </ImageContainer>

      <SectionTitle align={TextAlign.Center}>
        {i18n.t('entity.we_are_ready')}
      </SectionTitle>

      <SectionText align={TextAlign.Center} color={colors.lightText}>
        {i18n.t(
          'entity.your_company_was_created_successfully_no_you_cant_create_a_new_amg_proposal'
        )}
      </SectionText>

      <FlexContainer justify={FlexJustifyContent.Center}>
        <ButtonContainer>
          <Button large color={colors.accent1} href={DASHBOARD_PATH}>
            {i18n.t('entity.go_to_the_dashboard')}
          </Button>
        </ButtonContainer>

        <ButtonContainer>
          <Button large positive href={CREATE_PROCESS_PATH}>
            {i18n.t('entity.create_a_new_proposal')}
          </Button>
        </ButtonContainer>
      </FlexContainer>
    </ProcessReadyContainer>
  )
}

const ButtonContainer = styled.div`
  margin: 30px 10px;
`

const ProcessReadyContainer = styled.div`
  min-height: 600px;
  max-width: 620px;
  margin: auto;
`

const BackButtonContainer = styled(FlexContainer)`
  margin-top: 30px;
`
