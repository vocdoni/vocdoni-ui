import React, { useEffect } from 'react'
import styled from 'styled-components'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { Else, If, Then, When } from 'react-if'
import { ProcessCreationPageSteps } from '.'
import { useProcessCreation } from '../../hooks/process-creation'
import { Column, Grid } from '../grid'
import { SectionTitle } from '../text'

export const FormCreation = () => {
  const { creationError, pleaseWait, created } = useEntityCreation()
  const { methods } = useProcessCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(creationError)
  }, [creationError])

  // TODO: Do the styling of the entity creation first and adapt it here after

  return (<Grid>
    <Column>
      <SectionTitle>{i18n.t('vote.new_vote')}</SectionTitle>
    </Column>
    <Column>
      <When condition={pleaseWait}>
        <p>{i18n.t('entity.please_wait_creating_account')}</p>
      </When>
      <When condition={created}>
        <p>{i18n.t('entity.your_account_has_been_created')}</p>
      </When>
      <When condition={creationError}>
        <p>{creationError}</p>
      </When>

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
                <Button border onClick={() => methods.setPageStep(ProcessCreationPageSteps.OPTIONS)}>{i18n.t("action.go_back")}</Button>
                <Button positive onClick={methods.continueProcessCreation}>{i18n.t("action.retry")}</Button>
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
