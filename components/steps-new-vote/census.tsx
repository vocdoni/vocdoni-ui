import React, { useRef, useState } from 'react'
import styled from 'styled-components'

import { useProcessCreation } from '../../hooks/process-creation'
import i18n from '../../i18n'

import { Column, Grid } from '../grid'
import { Button } from '../button'
import { SectionTitle, SectionText, TextSize } from '../text'

import { ProcessCreationPageSteps } from '.'
import { CensusFileSelector } from './census-file-selector'
import { XlsReader } from '../../lib/xls-reader'
import { CensusFileData } from './census-file-data'

export const FormCensus = () => {
  const { methods, spreadSheetReader } = useProcessCreation()

  const handleOnXlsUpload = (spreadSheet: XlsReader) => {
    methods.setSpreadSheetReader(spreadSheet)
  }

  const handleOnChangeXls = () => {
    methods.setSpreadSheetReader(null)
  }

  const handleContinue = () => {
    methods.setPageStep(ProcessCreationPageSteps.OPTIONS)
  }
  
  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.import_the_list_of_voters')}</SectionTitle>
        <LightText>
          {i18n.t('vote.drag_a_spreadsheet_containing_personal_information')}
        </LightText>
      </Column>

      <Column>
        <CensusContainer>
          {spreadSheetReader ? (
            <CensusFileData
              fileName={spreadSheetReader.file.name}
              fileHeaders={spreadSheetReader.header}
              censusSize={spreadSheetReader.data.length}
              onChangeFile={handleOnChangeXls}
            />
          ) : (
            <CensusFileSelector onXlsLoad={handleOnXlsUpload} />
          )}
        </CensusContainer>

        <SectionText size={TextSize.Small}>
          {i18n.t(
            'vote.the_first_row_of_the_spreadsheet_will_be_used_as_the_name'
          )}
        </SectionText>
      </Column>

      <Column>
        <BottomDiv>
          <Button
            border
            onClick={() =>
              methods.setPageStep(ProcessCreationPageSteps.METADATA)
            }
          >
            {i18n.t('action.go_back')}
          </Button>
          <Button positive onClick={handleContinue} disabled={!spreadSheetReader}>
            {i18n.t('action.continue')}
          </Button>
        </BottomDiv>
      </Column>
    </Grid>
  )
}

const CensusContainer = styled.div<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

const LightText = styled(SectionText)`
  color: #7a859f;
`

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
