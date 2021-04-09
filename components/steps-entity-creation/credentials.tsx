import React, { useMemo, useState } from 'react'
import { Checkbox } from '@aragon/ui'

import { useEntityCreation } from '../../hooks/entity-creation'
import { Column, Grid } from '../grid'
import { Input } from '../inputs'
import { Button } from '../button'
import styled from 'styled-components'
import i18n from '../../i18n'
import { EntityCreationSteps } from '.'
import { checkStrength } from '../../lib/util'
import { useMessageAlert } from '../../hooks/message-alert'

export const FormCredentials = () => {
  const { setAlertMessage } = useMessageAlert()
  const { methods } = useEntityCreation()
  const [passphrase, setPassphrase] = useState("")
  const [passphrase2, setPassphrase2] = useState("")
  const [ack, setAck] = useState(false)

  const onValidate = () => {
    if (!passphrase) return setAlertMessage(i18n.t("errors.please_enter_a_passphrase"))
    else if (!passphrase2) return setAlertMessage(i18n.t("errors.please_repeat_the_passphrase"))
    const errMsg = checkStrength(passphrase)
    if (errMsg) return setAlertMessage(errMsg)
    else if (passphrase != passphrase2) return setAlertMessage(i18n.t("errors.the_passphrase_does_not_match"))
    else if (!ack) return setAlertMessage(i18n.t("errors.please_accept_credentials_tos"))

    // OK
    methods.setPassphrase(passphrase)
    methods.setStep(EntityCreationSteps.CREATION)
  }

  const disabledContinue = !passphrase || !passphrase2 || !ack

  return (
    <Grid>
      <Column span={12}>
        <h2>{i18n.t("entity.choose_a_passphrase")}</h2>
      </Column>
      <Column md={6}>
        <label htmlFor='pwd'>{i18n.t("entity.passphrase")}</label>
        <Input
          id='pwd'
          wide
          type='password'
          value={passphrase}
          onChange={e => setPassphrase(e.target.value)}
        />
      </Column>
      <Column md={6}>
        <label htmlFor='rep'>{i18n.t("entity.repeat_passphrase")}</label>
        <Input
          id='rep'
          wide
          type='password'
          value={passphrase2}
          onChange={e => setPassphrase2(e.target.value)}
        />
      </Column>
      <Column>
        <label>
          <Checkbox
            checked={ack}
            onChange={(ack: boolean) => setAck(ack)}
          />
          {i18n.t("entity.acknowledge_passphrase_implications")}
        </label>
      </Column>
      <Column>
        <BottomDiv>
          <Button border onClick={() => methods.setStep(EntityCreationSteps.METADATA)}>
            {i18n.t("action.go_back")}
          </Button>
          <Button
            positive
            onClick={onValidate}
            disabled={disabledContinue}
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
