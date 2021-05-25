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

interface ITermsModalProps {
  visible: boolean
  onAcceptTerms: () => void
  onCloseTerms: () => void
}

export const TermsModal = ({
  visible,
  onAcceptTerms,
  onCloseTerms,
}: ITermsModalProps) => {
  const [terms, setAcceptTerms] = useState<boolean>(false)
  const lang = i18n.language

  return (
    <Modal onRequestClose={onCloseTerms} isOpen={visible}>
      <TermsContainer>
        <Privacy lang={lang} />

        <PaddedContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <Checkbox
              id="terms-check"
              checked={terms}
              onChange={() => setAcceptTerms(!terms)}
              text={i18n.t(
                'entity.i_have_read_and_accept_the_terms_of_service'
              )}
              hrefNewTab
            />
          </FlexContainer>
        </PaddedContainer>

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive disabled={!terms} onClick={onAcceptTerms}>
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
