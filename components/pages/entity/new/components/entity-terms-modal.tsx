import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Modal from 'react-rainbow-components/components/Modal'
import { Terms } from '@components/pages/policy/terms/layer-2'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { Checkbox } from '@components/elements/checkbox'
import { Button } from '@components/elements/button'
import { useEntityCreation } from '@hooks/entity-creation'

interface IEntityTermsModalProps {
  visible: boolean
  onCloseEntityTerms: () => void
}

export const EntityTermsModal = ({
  visible,
  onCloseEntityTerms,
}: IEntityTermsModalProps) => {
  const { i18n } = useTranslation()
  const lang = i18n.language

  return (
    <Modal onRequestClose={onCloseEntityTerms} isOpen={visible}>
      <TermsContainer>
        <Terms lang={lang} />

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive onClick={onCloseEntityTerms}>
              {i18n.t('entity.accept_entity_terms')}
            </Button>
          </FlexContainer>
        </PaddedContainer>
      </TermsContainer>
    </Modal>
  )
}

const PaddedContainer = styled.div`
  margin-bottom: 20px;
`

const TermsContainer = styled.div`
  padding: 0 20px;
`
