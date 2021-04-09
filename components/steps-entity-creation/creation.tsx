import React, { useEffect } from 'react'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { EntityCreationSteps } from '.'
import { Else, If, Then } from 'react-if'

export const FormCreation = () => {
  const { error, creating, created, methods } = useEntityCreation()
  const { setAlertMessage } = useMessageAlert()

  useEffect(() => {
    setAlertMessage(error)
  }, [error])

  // TODO: use error, creating, created properly

  return (
    <div>
      <p>{i18n.t('entity.please_wait_creating_account')}</p>
      <p>Creating: {creating ? "YES" : "NO"}</p>
      <p>Created: {created ? "YES" : "NO"}</p>
      <p>Error: {error}</p>

      <If condition={created}>
        <Then>
          <Button href='/dashboard'>
            {i18n.t('action.go_to_dashboard')}
          </Button>
          <Button href='/processes/new' positive>
            {i18n.t('action.create_new_proposal')}
          </Button>
        </Then>
        <Else>
          <Button onClick={() => methods.setStep(EntityCreationSteps.CREDENTIALS)}>Go Back</Button>
          <Button onClick={methods.ensureSignedUp}>Retry</Button>

        </Else>
      </If>
    </div>
  )
  // return (
  //   <If condition={creating}>
  //     <Then>
  //       <div>{i18n.t('entity.please_wait_creating_account')}</div>
  //     </Then>
  //     <Else>
  //       <Button href='/dashboard'>
  //         {i18n.t('action.go_to_dashboard')}
  //       </Button>
  //       <Button href='/processes/new' positive>
  //         {i18n.t('action.create_new_proposal')}
  //       </Button>
  //     </Else>
  //   </If>
  // )
}
