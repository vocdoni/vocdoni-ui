import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { Else, If, Then } from 'react-if'
import { EntityCreationPageSteps } from '.'
import { CREATE_PROCESS_PATH, DASHBOARD_PATH } from '../../const/routes'
import { ProcessLoader } from '@components/process-loader'

const processSteps = [
  i18n.t('entity.confirming_details'),
  i18n.t('entity.signing_transactions'),
  i18n.t('entity.consolidating_path'),
  i18n.t('entity.validating_creation'),
]

export const FormCreation = () => {
  const { creationError, pleaseWait, created, methods, actionStep } = useEntityCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  return (
    <div>
      <If condition={!creationError}>
        <Then>
          <ProcessLoader
            steps={processSteps}
            currentStep={actionStep}
            title={i18n.t('vote.your_vote_process_is_being_created')}
            subtitle={i18n.t('vote.we_are_using_a_decentralized_secure_system')}
          />
        </Then>
      </If>

      <If condition={created}>
        <Then>
          <BottomDiv>
            <Button href={DASHBOARD_PATH}>
              {i18n.t('action.go_to_dashboard')}
            </Button>
            <Button href={CREATE_PROCESS_PATH} positive>
              {i18n.t('action.create_new_proposal')}
            </Button>
          </BottomDiv>
        </Then>
      </If>

      <If condition={creationError}>
        <Then>
          <BottomDiv>
            <Button border onClick={() => methods.setPageStep(EntityCreationPageSteps.CREDENTIALS)}>{i18n.t("action.go_back")}</Button>
            <Button border onClick={methods.continueEntityCreation}>{i18n.t("action.retry")}</Button>
          </BottomDiv>
        </Then>
      </If>
    </div>
  )
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
