import React, { useState } from 'react'
import { Checkbox } from '@components/elements/checkbox'
import styled from 'styled-components'

import i18n from '@i18n'

import { useEntityCreation } from '@hooks/entity-creation'
import { useMessageAlert } from '@hooks/message-alert'

import { checkStrength } from '@lib/util'

import { Column, Grid } from '@components/elements/grid'
import { Input } from '@components/elements/inputs'
import { Button } from '@components/elements/button'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { EntityCreationPageSteps } from '.'
import { Banner } from '@components/blocks/banners'
import { useScrollTop } from "@hooks/use-scroll-top"

export const FormCredentials = () => {
  useScrollTop()
  const { setAlertMessage } = useMessageAlert()
  const { methods } = useEntityCreation()
  const [passphrase, setPassphrase] = useState('')
  const [passphrase2, setPassphrase2] = useState('')
  const [ack, setAck] = useState(false)

  const onValidate = () => {
    if (!passphrase)
      return setAlertMessage(i18n.t('errors.please_enter_a_passphrase'))
    else if (!passphrase2)
      return setAlertMessage(i18n.t('errors.please_repeat_the_passphrase'))

    const errMsg = checkStrength(passphrase)
    if (errMsg) return setAlertMessage(errMsg)
    else if (passphrase != passphrase2)
      return setAlertMessage(i18n.t('errors.the_passphrase_does_not_match'))
    else if (!ack)
      return setAlertMessage(i18n.t('errors.please_accept_credentials_tos'))

    // OK

    methods.setPassphrase(passphrase)
    methods.setPageStep(EntityCreationPageSteps.CREATION)
  }

  const disabledContinue = !passphrase || !passphrase2 || !ack

  return (
    <Grid>
      <Banner
        warning
        title={i18n.t('entity.why_this_is_important')}
        subtitle={i18n.t(
          'entity.decentralized_accounts_cannot_be_recovered_by_and_external_agent'
        )}
        icon={
          <img
            width="160px"
            src="/images/entity/passphrase.png"
            alt={i18n.t('entity.passphrase_image_alt')}
          />
        }
      />

      <Column span={12}>
        <h2>{i18n.t('entity.choose_a_passphrase')}</h2>
      </Column>

      <Column md={6}>
        <label htmlFor="pwd">{i18n.t('entity.passphrase')}</label>
        <Input
          id="pwd"
          wide
          type="password"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
        />
      </Column>
      <Column md={6}>
        <label htmlFor="rep">{i18n.t('entity.repeat_passphrase')}</label>
        <Input
          id="rep"
          wide
          type="password"
          value={passphrase2}
          onChange={(e) => setPassphrase2(e.target.value)}
        />
      </Column>
      <Column>
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <Checkbox
            id="accept-terms"
            checked={ack}
            onChange={(ack: boolean) => setAck(ack)}
            text={i18n.t('entity.acknowledge_passphrase_implications')}
          />
        </FlexContainer>
      </Column>
      <Column>
        <BottomDiv>
          <Button
            border
            onClick={() =>
              methods.setPageStep(EntityCreationPageSteps.METADATA)
            }
          >
            {i18n.t('action.go_back')}
          </Button>

          <Button positive onClick={onValidate} disabled={disabledContinue}>
            {i18n.t('action.continue')}
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
