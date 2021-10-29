import React, { ChangeEvent, useRef, useState } from 'react'
import styled from 'styled-components'
import { Case, Default, Switch, When } from 'react-if'
import { Trans, useTranslation } from 'react-i18next'

import { useProcessCreation } from '@hooks/process-creation'

import { Column, Grid } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { SectionTitle, SectionText, TextSize } from '@components/elements/text'

import { ProcessCreationPageSteps } from '.'
import { CensusFileSelector } from './census-file-selector'
import { SpreadSheetReader } from '@lib/spread-sheet-reader'
import { CensusFileData } from './census-file-data'
import { colors } from 'theme/colors'
import { useScrollTop } from '@hooks/use-scroll-top'

import { ProcessTermsModal } from './components/process-terms-modal'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { RoundedCheck, RoundedCheckSize } from '@components/elements/rounded-check'
import { DownloadCsvTemplateCard } from './components/download-csv-template-card'
import { InputFormGroup } from '@components/blocks/form'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
import { Banner } from '@components/blocks/banners'

export const FormCensus = () => {
  const { i18n } = useTranslation()
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [censusRootError, setCensusRootError] = useState<string>()
  const [censusUriError, setCensusUriError] = useState<string>()

  const advancedCensusEnabled = !!process.env.ADVANCED_CENSUS || false

  useScrollTop()
  const { methods, spreadSheetReader, processTerms, parameters } = useProcessCreation()
  const { trackEvent } = useRudderStack()

  const continueDisabled = (!spreadSheetReader && !methods.checkValidCensusParameters())

  const handleOnXlsUpload = (spreadSheet: SpreadSheetReader) => {
    methods.setSpreadSheetReader(spreadSheet)
  }

  const handleOnChangeXls = () => {
    methods.setSpreadSheetReader(null)
  }

  const handleContinue = () => {
    trackEvent(TrackEvents.PROCESS_CREATION_WIZARD_BUTTON_CLICKED, { step: ProcessCreationPageSteps.SETTINGS })
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
          <DownloadCsvTemplateCardContainer>

          <DownloadCsvTemplateCard/>
          </DownloadCsvTemplateCardContainer>
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
        <Banner
          warning
          title={i18n.t('vote.disclaimer')}
          subtitle={
            <>
              <p>
                { i18n.t('vote.disclaimer_text') }
              </p>
              <FlexContainer
                alignItem={FlexAlignItem.Center}
              >
                <RoundedCheck size={RoundedCheckSize.Small} checked={processTerms}
                              onClick={() => methods.setProcessTerms(!processTerms)} />
                <TermsContainer>
                  <Trans
                    defaults={i18n.t('vote.i_have_read_and_accept_csv_terms')}
                    components={[
                      <a onClick={handleOpenTermsModal} />,
                    ]}
                  />
                </TermsContainer>
              </FlexContainer>
            </>
          }
          icon={
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M35.9978 6.00195C19.4305 6.00195 6 19.4324 6 35.9997C6 52.5671 19.4305 65.9975 35.9978 65.9975C52.5651 65.9975 65.9956 52.5671 65.9956 35.9997C65.9956 19.4324 52.5651 6.00195 35.9978 6.00195ZM0 35.9997C0 16.1187 16.1168 0.00195312 35.9978 0.00195312C55.8788 0.00195312 71.9956 16.1187 71.9956 35.9997C71.9956 55.8808 55.8788 71.9975 35.9978 71.9975C16.1168 71.9975 0 55.8808 0 35.9997ZM35.9969 18.5624C37.6537 18.5624 38.9969 19.9056 38.9969 21.5624V35.9986C38.9969 37.6555 37.6537 38.9986 35.9969 38.9986C34.34 38.9986 32.9969 37.6555 32.9969 35.9986V21.5624C32.9969 19.9056 34.34 18.5624 35.9969 18.5624ZM39.0907 48.3725C39.0907 50.081 37.7057 51.466 35.9972 51.466C34.2888 51.466 32.9038 50.081 32.9038 48.3725C32.9038 46.6641 34.2888 45.2791 35.9972 45.2791C37.7057 45.2791 39.0907 46.6641 39.0907 48.3725Z" fill="url(#paint0_linear_2771:9452)"/>
              <defs>
                <linearGradient id="paint0_linear_2771:9452" x1="-17.103" y1="-0.670334" x2="83.8199" y2="24.4028" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#FFFBA3"/>
                  <stop offset="1" stop-color="#FF2929"/>
                </linearGradient>
              </defs>
            </svg>
          }
        />
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

const DownloadCsvTemplateCardContainer = styled.div`
  margin-bottom: 30px;
`

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const TermsContainer = styled.span`
  margin: 0 10px
`
