import React, { useEffect } from 'react'
import styled from 'styled-components'
import { Else, If, Then, Unless, When } from 'react-if'

import { useMessageAlert } from '../../hooks/message-alert'
import { useProcessCreation } from '../../hooks/process-creation'

import { Button } from '../button'
import i18n from '../../i18n'
import { Column, Grid } from '../grid'
import { SectionText, SectionTitle, TextAlign } from '../text'
import { ProcessLoader } from '../process-loader'

import { ProcessCreationPageSteps } from '.'
// import { CREATE_PROCESS_PATH, DASHBOARD_PATH } from '../../const/routes'

const processSteps = [
  i18n.t('vote.uploading_metadata'),
  i18n.t('vote.creating_census'),
  i18n.t('vote.checking_details'),
  i18n.t('vote.creating_process'),
  i18n.t('vote.verifying_creation')
]

export const FormCreation = () => {
  const {
    creationError,
    pleaseWait,
    // created,
    actionStep,
  } = useProcessCreation()
  const { methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  return (
    <Grid>
      <Column>
        <If condition={creationError}>
          <Then>
            {/* DISPLAY ERROR */}
            <HeaderText align={TextAlign.Center}>{i18n.t("errors.something_went_wrong")}</HeaderText>
            <SectionText align={TextAlign.Center}>{creationError}</SectionText>
          </Then>
          <Else>
            {/* PLEASE WAIT */}
            <ProcessLoader
              steps={processSteps}
              currentStep={actionStep}
              title={i18n.t('vote.your_vote_process_is_being_created')}
              subtitle={i18n.t('vote.we_are_using_a_decentralized_secure_system')}
            />
          </Else>
        </If>

        {/* <If condition={created}>
          <Then>
            <BottomDiv>
              <Button href={DASHBOARD_PATH}>
                {i18n.t('action.go_to_the_dashboard')}
              </Button>
              <Button href={CREATE_PROCESS_PATH} positive>
                {i18n.t('action.create_new_proposal')}
              </Button>
            </BottomDiv>
          </Then>
          <Else> */}
        <Unless condition={pleaseWait}>
          <BottomDiv>
            <Button
              border
              onClick={() =>
                methods.setPageStep(ProcessCreationPageSteps.SETTINGS)
              }
            >
              {i18n.t('action.go_back')}
            </Button>
            <Button positive onClick={methods.continueProcessCreation}>
              {i18n.t('action.retry')}
            </Button>
          </BottomDiv>
        </Unless>
        {/* </Else>
        </If> */}
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const HeaderText = styled(SectionTitle)`
  font-size: 36px;
`
