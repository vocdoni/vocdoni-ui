import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-rainbow-components/components/Modal'
import i18n from '@i18n'
import { Terms } from '@components/policy/terms/layer-1'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/flex'
import { Checkbox } from '@components/checkbox'
import { Button } from '@components/button'
import { useEntityCreation } from '@hooks/entity-creation'

interface ITermsModalProps {
  visible: boolean
  onCloseTerms: () => void
}

export const TermsModal = ({
  visible,
  onCloseTerms,
}: ITermsModalProps) => {
  const {terms, methods} = useEntityCreation()
  const lang = i18n.language

  return (
    <Modal onRequestClose={onCloseTerms} isOpen={visible}>
      <TermsContainer>
        <Terms lang={lang} />

        <PaddedContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <Checkbox
              id="terms-check"
              checked={terms}
              onChange={() => methods.setTerms(!terms)}
              text={i18n.t(
                'entity.i_have_read_and_accept_personal_data_newsletter'
              )}
              hrefNewTab
            />
          </FlexContainer>
        </PaddedContainer>

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive disabled={!terms} onClick={onCloseTerms}>
              {i18n.t('entity.accept_terms')}
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
