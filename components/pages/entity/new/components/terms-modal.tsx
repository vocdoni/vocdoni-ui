import React from 'react'
import styled from 'styled-components'
import Modal from 'react-rainbow-components/components/Modal'
import { Terms } from '@components/pages/policy/terms/layer-1'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { Checkbox } from '@components/elements/checkbox'
import { Button } from '@components/elements/button'
import { useEntityCreation } from '@hooks/entity-creation'
import { useTranslation } from 'react-i18next'

interface ITermsModalProps {
  visible: boolean
  onCloseTerms: () => void
}

export const TermsModal = ({
  visible,
  onCloseTerms,
}: ITermsModalProps) => {
  const { i18n } = useTranslation()
  const lang = i18n.language

  return (
    <Modal onRequestClose={onCloseTerms} isOpen={visible}>
      <TermsContainer>
        <Terms lang={lang} />

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive onClick={onCloseTerms}>
              {i18n.t('entity.accept_terms')}
            </Button>
          </FlexContainer>
        </PaddedContainer>
      </TermsContainer>
    </Modal>
  )
}

const PaddedContainer = styled.div`
  padding-top: 12px;
  margin-bottom: 20px;
`

const TermsContainer = styled.div`
  padding: 0 20px;
`
