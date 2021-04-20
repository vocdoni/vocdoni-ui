import React, { ChangeEvent, Component, useState } from 'react'
import { Checkbox } from '@aragon/ui'

import { useProcessCreation } from '../../hooks/process-creation'
import { Column, Grid } from '../grid'

import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionTitle } from '../text'
import { ProcessCreationPageSteps } from '.'

export const FormOptions = () => {
  const { metadata, parameters, methods } = useProcessCreation()


  const valid = () => {
    // TODO:  if Start right await =>  startdate = now + 8 min

    // TODO: Add more here
    return true
  }

  const onSubmit = () => {
    // TODO: Validate, check, etc

    methods.createProcess() // Trigger the main action
    methods.setPageStep(ProcessCreationPageSteps.CREATION)
  }

  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.new_vote')}</SectionTitle>
      </Column>
      <Column>
        <BottomDiv>
          <Button border onClick={() => methods.setPageStep(ProcessCreationPageSteps.CENSUS)}>
            {i18n.t("action.go_back")}
          </Button>
          <Button
            positive
            onClick={() => onSubmit()}
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
