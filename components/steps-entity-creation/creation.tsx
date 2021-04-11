import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { Else, If, Then } from 'react-if'
import { EntityCreationPageSteps } from '.'

export const FormCreation = () => {
  const { creationError, pleaseWait, created, methods } = useEntityCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  return (
    <div>
      {pleaseWait ? <p>{i18n.t('entity.please_wait_creating_account')}</p> : null}
      {created ? <p>{i18n.t('entity.your_account_has_been_created')}</p> : null}
      {creationError ? <p>{creationError}</p> : null}

      <If condition={created}>
        <Then>
          <BottomDiv>
            <Button href='/dashboard'>
              {i18n.t('action.go_to_dashboard')}
            </Button>
            <Button href='/processes/new' positive>
              {i18n.t('action.create_new_proposal')}
            </Button>
          </BottomDiv>
        </Then>
        <Else>
          <If condition={pleaseWait}>
            <Else>
              <BottomDiv>
                <Button border onClick={() => methods.setPageStep(EntityCreationPageSteps.CREDENTIALS)}>Go Back</Button>
                <Button border onClick={methods.continueEntityCreation}>Retry</Button>
              </BottomDiv>
            </Else>
          </If>
        </Else>
      </If>
    </div>
  )
}

const BottomDiv = styled.div`
display: flex;
flex-direction: row;
justify-content: space-between;
`
