import React, { ChangeEvent, Component } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { useProcessCreation } from '../../hooks/process-creation'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionTitle } from '../text'
import { ProcessCreationPageSteps } from '.'


export const FormCensus = () => {
  const { metadata, parameters, methods } = useProcessCreation()

  const valid = () => {
    // TODO: Add more here
    return true
  }

  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.new_vote')}</SectionTitle>
      </Column>
      <Column>
        <BottomDiv>
          <Button border onClick={() => methods.setPageStep(ProcessCreationPageSteps.METADATA)}>
            {i18n.t("action.go_back")}
          </Button>
          <Button
            positive
            onClick={() => methods.setPageStep(ProcessCreationPageSteps.OPTIONS)}
            disabled={!valid()}
          >
            {i18n.t("action.continue")}
          </Button>
        </BottomDiv>
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
