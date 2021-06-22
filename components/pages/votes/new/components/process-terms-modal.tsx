import React, { useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-rainbow-components/components/Modal'
import i18n from '@i18n'
// import { Terms } from '@components/policy/terms/layer-2'

import { CsvTerms } from '@components/pages/policy/csv-terms/layer-1'
import {
  FlexAlignItem,
  FlexContainer,
  FlexJustifyContent,
} from '@components/elements/flex'
import { Checkbox } from '@components/elements/checkbox'
import { Button } from '@components/elements/button'
import { useProcessCreation } from '@hooks/process-creation'

interface IEntityTermsModalProps {
  visible: boolean
  onCloseProcessTerms: () => void
}

export const ProcessTermsModal = ({
  visible,
  onCloseProcessTerms,
}: IEntityTermsModalProps) => {
  const {processTerms, methods} = useProcessCreation()
  const lang = i18n.language

  return (
    <Modal onRequestClose={onCloseProcessTerms} isOpen={visible}>
      <TermsContainer>
        <CsvTerms lang={lang} />
        {/* <Terms lang={lang} /> */}
        <PaddedContainer>
          <FlexContainer alignItem={FlexAlignItem.Center}>
            <Checkbox
              id="voter-terms-check"
              checked={processTerms}
              onChange={() => methods.setProcessTerms(!processTerms)}
              text={i18n.t(
                'vote.i_have_read_and_accept_csv_terms'
              )}
              hrefNewTab
            />
          </FlexContainer>
        </PaddedContainer>

        <PaddedContainer>
          <FlexContainer justify={FlexJustifyContent.Center}>
            <Button positive disabled={!processTerms} onClick={onCloseProcessTerms}>
              {i18n.t('vote.accept_terms')}
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
