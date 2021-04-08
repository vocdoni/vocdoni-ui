import { Wallet } from '@ethersproject/wallet'
import { EntityApi, EntityMetadata, EntityMetadataTemplate, Symmetric } from 'dvote-js'
import React, { useEffect, useState } from 'react'
import { Buffer } from 'buffer/'
import { usePool } from '@vocdoni/react-hooks'
import { Else, If, Then } from 'react-if'

import { useEntityCreation } from '../../hooks/entity-creation'
import { useMessageAlert } from '../../hooks/message-alert'
import { Button } from '../button'
import i18n from '../../i18n'
import { EntityCreationStepProps } from '../../lib/types'

const EntityCreation = (props: EntityCreationStepProps) => {
  const { error, creating, created } = useEntityCreation()
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
      <p>(Button to retry?)</p>

      <Button href='/dashboard'>
        {i18n.t('action.go_to_dashboard')}
      </Button>
      <Button href='/processes/new' positive>
        {i18n.t('action.create_new_proposal')}
      </Button>
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

export default EntityCreation
