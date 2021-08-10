import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Modal from 'react-rainbow-components/components/Modal'
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
  const { i18n } = useTranslation()
  const {privacy, methods} = useEntityCreation()
  const lang = i18n.language

  return (
    <Modal onRequestClose={onClosePrivacy} isOpen={visible}>
      <PrivacyContainer>
        <Privacy lang={lang} />

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive onClick={onClosePrivacy}>
              {i18n.t('entity.accept_Privacy')}
            </Button>
          </FlexContainer>
        </PaddedContainer>
      </PrivacyContainer>
    </Modal>
  )
}

const PaddedContainer = styled.div`
  padding-top: 12px;
  margin-bottom: 20px;
`

const PrivacyContainer = styled.div`
  padding: 0 20px;
`
