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
import { colors } from 'theme/colors'

import { ProcessTermsModal } from './components/process-terms-modal'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { DownloadCsvTemplateCard } from './components/download-csv-template-card'
import { InputFormGroup } from '@components/blocks/form'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
import { VotingTypeButtons } from './components/voting-type-buttons'
import { ConfirmModal } from '@components/blocks/confirm-modal'
import { ImportVoterListNormal } from './components/import-voter-list-normal'
import { ImportVoterListWeighted } from './components/import-voter-list-wighted'
import { DisclaimerBanner } from './components/disclaimer-banner'

export enum VotingType {
  Normal = 'normal',
  Weighted = 'weighted',
}

export const FormCensus = () => {
  const { i18n } = useTranslation()
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [censusRootError, setCensusRootError] = useState<string>()
  const [censusUriError, setCensusUriError] = useState<string>()
  const [votingType, setVotingType] = useState<VotingType>(VotingType.Normal)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const changeVotingTypeRef = useRef<VotingType>()
  const advancedCensusEnabled = !!process.env.ADVANCED_CENSUS || false

  const {
    methods,
    spreadSheetReader,
    processTerms,
    parameters,
  } = useProcessCreation()
  const { trackEvent } = useRudderStack()

  const continueDisabled =
    !spreadSheetReader && !methods.checkValidCensusParameters()

  const handleOnXlsUpload = (spreadSheet: SpreadSheetReader) => {
    methods.setSpreadSheetReader(spreadSheet)
  }

  const handleOnChangeXls = () => {
    methods.setSpreadSheetReader(null)
  }

  const handleContinue = () => {
    trackEvent(TrackEvents.PROCESS_CREATION_WIZARD_BUTTON_CLICKED, {
      step: ProcessCreationPageSteps.SETTINGS,
    })

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

  const handleChangeVotingType = (votingType: VotingType) => {
    console.log(spreadSheetReader)
    if (!spreadSheetReader) {
      setVotingType(votingType)
    } else {
      changeVotingTypeRef.current = votingType
      setShowConfirmModal(true)
    }
  }

  const handleCloseModal = () => {
    setShowConfirmModal(false)
  }

  const handleConfirmChangeVotingType = () => {
    setShowConfirmModal(false)
    setVotingType(changeVotingTypeRef.current)
    methods.setSpreadSheetReader(null)
  }

  return (
    <>
      <Grid>
        <When condition={!showAdvanced}>
          <>
            <Column>
              <Typography variant={TypographyVariant.Body1} margin="10px 0 0 0">
                1. {i18n.t('votes.new.select_voting_options')}
              </Typography>
            </Column>

            <Column>
              <VotingTypeButtons
                onClick={handleChangeVotingType}
                votingType={votingType}
              />
            </Column>

            <Column>
              <Typography variant={TypographyVariant.Body1} margin="10px 0 0 0">
                2. {i18n.t('votes.new.import_the_list_of_voters')}
              </Typography>

              {votingType === VotingType.Normal && <ImportVoterListNormal />}
              {votingType === VotingType.Weighted && (
                <ImportVoterListWeighted />
              )}
            </Column>

            <Column>
              <CensusContainer>
                {/* <DownloadCsvTemplateCardContainer>
                  <DownloadCsvTemplateCard />
                </DownloadCsvTemplateCardContainer> */}

                <CensusFileSelector
                  onXlsLoad={handleOnXlsUpload}
                  votingType={votingType}
                  loadedXls={spreadSheetReader}
                />
              </CensusContainer>
            </Column>
          </>
        </When>

        <When condition={showAdvanced && advancedCensusEnabled}>
          <>
            <Column>
              <SectionTitle>
                {i18n.t('vote.import_the_list_of_voters')}
              </SectionTitle>
              <SectionText color={colors.lightText}>
                {'Advanced options'}
              </SectionText>
            </Column>

            <Column md={6} sm={12}>
              <InputFormGroup
                title="CensusRoot"
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
              onClick={() => setShowAdvanced((a) => !a)}
              // disabled={!spreadSheetReader}
            >
              {!showAdvanced
                ? 'Show Advanced Options'
                : 'Hide Advanced Options'}
            </Button>
          </When>
        </Column>

        <Column>
          {spreadSheetReader && (
            <DisclaimerBanner
              onClickTerms={() => methods.setProcessTerms(!processTerms)}
              onOpenTerms={handleOpenTermsModal}
              termsAccepted={processTerms}
            />
          )}
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
              <Case condition={!spreadSheetReader}>
                <Button positive onClick={handleOpenTermsModal}>
                  {i18n.t('action.review_process_terms_and_conditions')}
                </Button>
              </Case>

              <Case condition={!spreadSheetReader}>
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

        <ProcessTermsModal
          visible={showTermsModal}
          onCloseProcessTerms={handleCloseTermsModal}
        />
      </Grid>

      <ConfirmModal
        body={i18n.t(
          'votes.new.if_change_the_type_of_vote_the_updated_census_will_be_lost'
        )}
        onCancel={handleCloseModal}
        onConfirm={handleConfirmChangeVotingType}
        isOpen={showConfirmModal}
      />
    </>
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
