import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { If, Then } from 'react-if'
import { EntityCreationPageSteps } from '.'
import { ProcessLoader } from '@components/process-loader'
import { useScrollTop } from "@hooks/use-scroll-top"

const processSteps = [
  i18n.t('entity.confirming_details'),
  i18n.t('entity.signing_transactions'),
  i18n.t('entity.consolidating_path'),
  i18n.t('entity.validating_creation'),
]

export const FormCreation = () => {
  useScrollTop()
  const { creationError, created, methods, actionStep } = useEntityCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  useEffect(() => {
    if (created) {
      methods.setPageStep(EntityCreationPageSteps.CREATED)
    }
  }, [created])

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

      <If condition={creationError}>
        <Then>
          <BottomDiv>
            <Button
              border
              onClick={() =>
                methods.setPageStep(EntityCreationPageSteps.CREDENTIALS)
              }
            >
              {i18n.t('action.go_back')}
            </Button>
            <Button border onClick={methods.continueEntityCreation}>
              {i18n.t('action.retry')}
            </Button>
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
