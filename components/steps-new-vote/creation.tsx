import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Else, If, Then, When } from 'react-if'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { useProcessCreation } from '../../hooks/process-creation'

import { Button } from '../button'
import i18n from '../../i18n'
import { Column, Grid } from '../grid'
import { SectionTitle } from '../text'
import { ProcessLoader } from '../process-loader'

import { ProcessCreationPageSteps } from '.'

const processSteps = [
  i18n.t('vote.confirm_details'),
  i18n.t('vote.signing_transactions'),
  i18n.t('vote.consolidating_path'),
  i18n.t('vote.creating_process'),
]

export const FormCreation = () => {
  const {
    creationError,
    pleaseWait,
    created,
    actionStep,
  } = useProcessCreation()
  const { methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  // TODO: Do the styling of the entity creation first and adapt it here after

  return (
    <Grid>
      <Column>
        <ProcessLoader
          steps={processSteps}
          currentStep={actionStep}
          title={i18n.t('vote.your_vote_process_is_being_created')}
          subtitle={i18n.t('vote.we_are_using_a_decentralized_secure_system')}
        />

        <If condition={created}>
          <Then>
            <BottomDiv>
              <Button href="/dashboard">
                {i18n.t('action.go_to_dashboard')}
              </Button>
              <Button href="/processes/new" positive>
                {i18n.t('action.create_new_proposal')}
              </Button>
            </BottomDiv>
          </Then>
          <Else>
            <If condition={pleaseWait}>
              <Else>
                <BottomDiv>
                  <Button
                    border
                    onClick={() =>
                      methods.setPageStep(ProcessCreationPageSteps.OPTIONS)
                    }
                  >
                    {i18n.t('action.go_back')}
                  </Button>
                  <Button positive onClick={methods.continueProcessCreation}>
                    {i18n.t('action.retry')}
                  </Button>
                </BottomDiv>
              </Else>
            </If>
          </Else>
        </If>
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
