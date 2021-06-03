import React, { ChangeEvent, useRef, useState } from 'react'
import styled from 'styled-components'
import { Case, Default, Switch, When } from 'react-if'

import { useProcessCreation } from '../../hooks/process-creation'
import i18n from '../../i18n'

import { Column, Grid } from '../grid'
import { Button } from '../button'
import { SectionTitle, SectionText, TextSize } from '../text'

import { ProcessCreationPageSteps } from '.'
import { CensusFileSelector } from './census-file-selector'
import { SpreadSheetReader } from '../../lib/spread-sheet-reader'
import { CensusFileData } from './census-file-data'
import { colors } from 'theme/colors'
import { useScrollTop } from '@hooks/use-scroll-top'

import { ProcessTermsModal } from './components/process-terms-modal'
import { FlexAlignItem, FlexContainer } from '@components/flex'
import { RoundedCheck, RoundedCheckSize } from '@components/elements/rounded-check'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { InputFormGroup } from '@components/form'

export const FormCensus = () => {
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [censusRootError, setCensusRootError] = useState<string>()
  const [censusUriError, setCensusUriError] = useState<string>()

  const advancedCensusEnabled = !!process.env.ADVANCED_CENSUS || false

  useScrollTop()
  const { methods, spreadSheetReader, processTerms, parameters } = useProcessCreation()

  const continueDisabled = (!spreadSheetReader && !methods.checkValidCensusParameters())

  const handleOnXlsUpload = (spreadSheet: SpreadSheetReader) => {
    methods.setSpreadSheetReader(spreadSheet)
  }

  const handleOnChangeXls = () => {
    methods.setSpreadSheetReader(null)
  }

  const handleContinue = () => {
    methods.setPageStep(ProcessCreationPageSteps.SETTINGS)
  }

  const handleOpenTermsModal = () => {
    setShowTermsModal(true)
  }

  const handleCloseTermsModal = () => {
    setShowTermsModal(false)
  }

  const handleOnChangeCensusRoot = (event: ChangeEvent<HTMLInputElement>) => {
    methods.setCensusRoot(event.target.value)

    if (!event.target.value) {
      setCensusRootError(i18n.t('vote.invalid_census_root'))
    } else {
      setCensusRootError('')
    }
  }

  const handleOnChangeCensusUri = (event: ChangeEvent<HTMLInputElement>) => {
    methods.setCensusUri(event.target.value)

    if (!event.target.value) {
      setCensusUriError(i18n.t('vote.invalid_census_uri'))
    } else {
      setCensusUriError('')
    }
  }
  return (
    <Grid>
      <When condition={!showAdvanced}>
        <>
          <Column>
            <SectionTitle>{i18n.t('vote.import_the_list_of_voters')}</SectionTitle>
            <SectionText color={colors.lightText}>
              {i18n.t('vote.drag_a_spreadsheet_containing_personal_information')}
            </SectionText>
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
        </>
      </When>

      <When condition={showAdvanced && advancedCensusEnabled}>
        <>
          <Column>
            <SectionTitle>{i18n.t('vote.import_the_list_of_voters')}</SectionTitle>
            <SectionText color={colors.lightText}>
              {'Advanced options'}
            </SectionText>
          </Column>

          <Column md={6} sm={12}>
            <InputFormGroup
              title='CensusRoot'
              label={i18n.t('vote.census_root_value')}
              placeholder={i18n.t('vote.0x000')}
              helpText={i18n.t('vote.stream_link_explanation')}
              error={censusRootError}
              // id={MetadataFields.StreamLink}
              value={parameters.censusRoot}
              // error={getErrorMessage(MetadataFields.StreamLink)}
              // onBlur={() => handleBlur(MetadataFields.StreamLink)}
              onChange={handleOnChangeCensusRoot}
            />
          </Column>


          <Column md={6} sm={12}>
            <InputFormGroup
              title={'CensusURI'}
              label={'CensusURI'}
              placeholder={'ipfs//:'}
              error={censusUriError}
              // helpText={i18n.t('vote.stream_link_explanation')}
              // id={MetadataFields.StreamLink}
              value={parameters.censusUri}
              // error={getErrorMessage(MetadataFields.StreamLink)}
              // onBlur={() => handleBlur(MetadataFields.StreamLink)}
              onChange={handleOnChangeCensusUri}
            />
          </Column>
        </>
      </When>

      <Column>
        <FlexContainer
          alignItem={FlexAlignItem.Center}
          onClick={handleOpenTermsModal}
        ></FlexContainer>
        <When condition={advancedCensusEnabled}>
          <Button
            positive
            onClick={() => setShowAdvanced(a => !a)}
          // disabled={!spreadSheetReader}
          >
            {(!showAdvanced) ? 'Show Advanced Options' : 'Hide Advanced Options'}
          </Button>
        </When>
      </Column>


      <Column>
        <FlexContainer
          alignItem={FlexAlignItem.Center}
          onClick={handleOpenTermsModal}
        >
          <RoundedCheck size={RoundedCheckSize.Small} checked={processTerms} />
          <Typography variant={TypographyVariant.Small} margin="0 10px">
            {i18n.t('vote.i_have_read_and_accept_csv_terms')}
          </Typography>
        </FlexContainer>
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

          <Switch>
            <Case condition={!processTerms}>
              <Button positive onClick={handleOpenTermsModal}>
                {i18n.t('action.review_process_terms_and_conditions')}
              </Button>
            </Case>

            <Default>
              <Button
                positive
                onClick={handleContinue}
                //TODO handle case where both EXcel and parameters exist
                disabled={continueDisabled}
              >
                {i18n.t('action.continue')}
              </Button>
            </Default>
          </Switch>
        </BottomDiv>
      </Column>

      <ProcessTermsModal visible={showTermsModal} onCloseProcessTerms={handleCloseTermsModal} />
    </Grid >
  )
}

const CensusContainer = styled.div<{ disabled?: boolean }>`
  opacity: ${({ disabled }) => (disabled ? '0.6' : '1')};
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
`

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
