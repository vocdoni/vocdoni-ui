import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-rainbow-components/components/Modal'
import i18n from '@i18n'
import { Privacy } from '@components/pages/policy/privacy/layer-1'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { Checkbox } from '@components/elements/checkbox'
import { Button } from '@components/elements/button'
import { useEntityCreation } from '@hooks/entity-creation'

interface IPrivacyModalProps {
  visible: boolean
  onClosePrivacy: () => void
}

export const PrivacyModal = ({
  visible,
  onClosePrivacy,
}: IPrivacyModalProps) => {
  const {privacy, methods} = useEntityCreation()
  const lang = i18n.language

  return (
    <Modal onRequestClose={onClosePrivacy} isOpen={visible}>
      <PrivacyContainer>
        <Privacy lang={lang} />

        <PaddedContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <Checkbox
              id="Privacy-check"
              checked={privacy}
              onChange={() => methods.setPrivacy(!privacy)}
              text={i18n.t(
                'entity.i_have_read_and_accept_personal_data_protection'
              )}
              hrefNewTab
            />
          </FlexContainer>
        </PaddedContainer>

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive disabled={!privacy} onClick={onClosePrivacy}>
              {i18n.t('entity.accept_Privacy')}
            </Button>
          </FlexContainer>
        </PaddedContainer>
      </PrivacyContainer>
    </Modal>
  )
}

const PaddedContainer = styled.div`
  margin-bottom: 20px;
`

const PrivacyContainer = styled.div`
  padding: 0 20px;
`
