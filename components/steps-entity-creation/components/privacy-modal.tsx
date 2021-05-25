import React, { useState } from 'react'
import styled from 'styled-components'
import { Modal } from 'react-rainbow-components'
import i18n from '@i18n'
import { Privacy } from '@components/policy/privacy/layer-1'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/flex'
import { Checkbox } from '@components/checkbox'
import { Button } from '@components/button'

interface IPrivacyModalProps {
  visible: boolean
  onAcceptPrivacy: () => void
  onClosePrivacy: () => void
}

export const PrivacyModal = ({
  visible,
  onAcceptPrivacy,
  onClosePrivacy,
}: IPrivacyModalProps) => {
  const [privacy, setAcceptPrivacy] = useState<boolean>(false)
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
              onChange={() => setAcceptPrivacy(!privacy)}
              text={i18n.t(
                'entity.i_have_read_and_accept_the_Privacy_of_service'
              )}
              hrefNewTab
            />
          </FlexContainer>
        </PaddedContainer>

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive disabled={!privacy} onClick={onAcceptPrivacy}>
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
