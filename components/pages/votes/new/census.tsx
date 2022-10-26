import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Case, Default, Switch } from 'react-if'
import { useTranslation } from 'react-i18next'

import { useProcessCreation } from '@hooks/process-creation'


import { ProcessCreationPageSteps } from '.'
import { CensusFileSelector } from './census-file-selector'
import { SpreadSheetReader } from '@lib/spread-sheet-reader'

import { ProcessTermsModal } from './components/process-terms-modal'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'

import { InputFormGroup } from '@components/blocks/form'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
// import { SelectorButton, VotingTypeButtons } from './components/voting-type-buttons'
import { ConfirmModal } from '@components/blocks/confirm-modal'
import { ImportVoterListNormal } from './components/import-voter-list-normal'
import { ImportVoterListWeighted } from './components/import-voter-list-wighted'
import { DisclaimerBanner } from './components/disclaimer-banner'
import { VotingType } from '@lib/types'
import { Col, Row, Text, Button } from '@components/elements-v2'
import { SelectorButton } from './components/selector-button'
import { BinaryCard } from './components/binary-card'
import { AnonymousMessage } from './components/anonymous-message'
import { useScrollTop } from '@hooks/use-scroll-top'
import { Banner, BannerVariant, BannerSize } from '@components/blocks/banner_v2'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { colors } from '@theme/colors'

export const FormCensus = () => {
  useScrollTop()
  const { i18n } = useTranslation()
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)
  const [censusRootError, setCensusRootError] = useState<string>()
  const [censusUriError, setCensusUriError] = useState<string>()
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)
  const [showAnonymous, setShowAnonymous] = useState<boolean>(false)
  const [anonymousWeightedNotAllowed, setAnonymousWeightedNotAllowed] = useState<boolean>(false)
  const changeVotingTypeRef = useRef<VotingType>()
  const advancedCensusEnabled = !!process.env.ADVANCED_CENSUS || false
  const {
    methods,
    spreadSheetReader,
    processTerms,
    parameters,
    votingType,
    anonymousVoting,
  } = useProcessCreation()
  const { trackEvent } = useRudderStack()

  const continueDisabled =
    !spreadSheetReader && !methods.checkValidCensusParameters()

  useEffect(() => {
    setShowAnonymous(votingType === VotingType.Normal)
  }, [votingType])

  const handleOnXlsUpload = (spreadSheet: SpreadSheetReader) => {
    methods.setSpreadSheetReader(spreadSheet)
  }

  const handleContinue = () => {
    if (!processTerms) {
      return
    }

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
    if(votingType === VotingType.Weighted && anonymousVoting){
      setAnonymousWeightedNotAllowed(true)
      methods.setAnonymousVoting(false)
    }

    if(votingType === VotingType.Normal){
      setAnonymousWeightedNotAllowed(false)
    }

    if (!spreadSheetReader) {
      methods.setVotingType(votingType)
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
    methods.setVotingType(changeVotingTypeRef.current)
    methods.setSpreadSheetReader(null)
  }

  const handleChangeAnonymous = (anonymous: boolean) => {
    methods.setAnonymousVoting(anonymous)
  }
  const votingTypeOptions = [
    {
      title: i18n.t('votes.new.normal_voting'),
      subtitle: i18n.t('votes.new.all_the_voters_has_the_same_power'),
      value: VotingType.Normal
    },
    {
      title: i18n.t('votes.new.weighted_voting'),
      subtitle: i18n.t('votes.new.set_different_power_to_each_voter'),
      value: VotingType.Weighted
    }
  ]
  return (
    <>
      <Row gutter='2xl'>
        {/* MAIN NOT ADVANCED */}
        {!showAdvanced &&
          <Col xs={12}>
            <Row gutter='4xl'>
              {/* SELECT VOTE */}
              <Col xs={12}>
                <Row gutter='lg'>
                  <Col xs={12}>
                    <Text size='2xl' color='dark-blue' >
                      1. {i18n.t('votes.new.select_voting_type')}
                    </Text>
                  </Col>
                  <Col xs={12}>
                    <SelectorButton
                      onClick={handleChangeVotingType}
                      options={votingTypeOptions} // const items: Options[] =
                      value={votingType}
                    />
                  </Col>
                  {votingType === VotingType.Weighted && anonymousWeightedNotAllowed &&
                    <Col>
                      <div>{i18n.t('votes.new.anonymous_weighted_warning_msg')}</div>
                    </Col>
                  }
                </Row>
              </Col>
              {/* SELECT ANONYMOUS */}
              {showAnonymous &&
                <Col xs={12}>
                  <Row gutter='lg'>
                    <Col xs={12}>
                      <Text size='2xl' color='dark-blue' >
                        2. {i18n.t('votes.new.select_voting_options')}
                      </Text>
                    </Col>
                    <Col xs={12}>
                      <BinaryCard
                        value={anonymousVoting}
                        onChange={handleChangeAnonymous}
                        title={i18n.t('votes.new.anonymous_voting')}
                        subtitle={i18n.t('votes.new.would_you_like_this_voting_process_to_ensure_cryptographic_anonymity')}
                      >
                        <AnonymousMessage />

                        <p></p>

                        <Banner
                          icon={<img src="/images/vote/disclaimer.svg" />}
                          variant={BannerVariant.Secondary}
                          size={BannerSize.Small}
                        >
                          <Typography
                            variant={TypographyVariant.H5}
                            color={colors.warningText}
                            margin="0 0 10px 0"
                          >
                            {i18n.t('votes.new.disclaimer')}
                          </Typography>

                          <Typography
                            variant={TypographyVariant.H6}
                            color={colors.lightText}
                            margin='0 0 0 0'
                          >
                            {i18n.t('votes.new.disclaimer_anonymous1')}<br />
                            {i18n.t('votes.new.disclaimer_anonymous2')}
                          </Typography>
                        </Banner>
                      </BinaryCard>
                    </Col>
                  </Row>
                </Col>
              }
              {/* UPLOAD CENSUS */}
              <Col xs={12}>
                <Row gutter='lg'>
                  <Col xs={12}>
                    <Text size='2xl' color='dark-blue' >
                      {showAnonymous ? '3' : '2'}. {i18n.t('votes.new.import_the_list_of_voters')}
                    </Text>
                  </Col>
                  <Col>
                    <Row gutter='xl'>
                      <Col xs={12}>

                        {votingType === VotingType.Normal &&
                          <ImportVoterListNormal />
                        }
                        {votingType === VotingType.Weighted &&
                          <ImportVoterListWeighted />
                        }
                      </Col>
                      <Col xs={12} disableFlex>
                        <CensusContainer>
                          <CensusFileSelector
                            onXlsLoad={handleOnXlsUpload}
                            votingType={votingType}
                            loadedXls={spreadSheetReader}
                          />
                        </CensusContainer>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        }

        {/* ADVANCED SETIINGS */}
        {(showAdvanced && advancedCensusEnabled) &&
          <>
            <Col xs={12}>
              <Row>
                <Col xs={12} md={6} disableFlex>
                  <InputFormGroup
                    title="CensusRoot"
                    label={i18n.t('vote.census_root_value')}
                    placeholder={i18n.t('vote.0x000')}
                    helpText={i18n.t('vote.stream_link_explanation')}
                    error={censusRootError}
                    value={parameters.censusRoot}
                    onChange={handleOnChangeCensusRoot}
                  />
                </Col>
                <Col>
                </Col>
                <Col xs={12} md={6} disableFlex>
                  <InputFormGroup
                    title={'CensusURI'}
                    label={'CensusURI'}
                    placeholder={'ipfs//:'}
                    error={censusUriError}
                    value={parameters.censusUri}
                    onChange={handleOnChangeCensusUri}
                  />
                </Col>
              </Row>
            </Col>
          </>
        }
        {advancedCensusEnabled &&
          <Col xs={12}>
            <FlexContainer
              alignItem={FlexAlignItem.Center}
              onClick={handleOpenTermsModal}
            ></FlexContainer>
            {/* <When condition={advancedCensusEnabled}> */}
            <Button
              variant='primary'
              onClick={() => setShowAdvanced((a) => !a)}
            // disabled={!spreadSheetReader}
            >
              {!showAdvanced
                ? 'Show Advanced Options'
                : 'Hide Advanced Options'}
            </Button>
          </Col>
        }

        {/* DISCLAIMER BANNER */}
        {spreadSheetReader && (
          <Col xs={12}>
            <DisclaimerBanner
              onClickTerms={() => methods.setProcessTerms(!processTerms)}
              onOpenTerms={handleOpenTermsModal}
              termsAccepted={processTerms}
            />
          </Col>
        )}

        {/* ACTIONS */}
        <Col xs={12}>
          <Row justify='space-between'>
            <Col xs={2}>
              <Button
                variant='white'
                onClick={() => methods.setPageStep(ProcessCreationPageSteps.METADATA)}
              >
                {i18n.t('action.back')}
              </Button>
            </Col>
            <Col>
              <Switch>
                <Case condition={!spreadSheetReader}>
                  <Button variant='primary' disabled>
                    {i18n.t('action.upload_list_of_voters')}
                  </Button>
                </Case>

                <Case condition={spreadSheetReader}>
                  <Button
                    variant='primary'
                    disabled={!processTerms}
                    onClick={handleContinue}
                  >
                    {processTerms
                      ? i18n.t('action.continue')
                      : i18n.t('action.review_process_terms_and_conditions')}
                  </Button>
                </Case>
                <Default>
                  <Button
                    variant='primary'
                    onClick={handleContinue}
                    //TODO handle case where both EXcel and parameters exist
                    disabled={continueDisabled}
                  >
                    {i18n.t('action.continue')}
                  </Button>
                </Default>
              </Switch>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* TERMS MODAL */}
      <ProcessTermsModal
        visible={showTermsModal}
        onCloseProcessTerms={handleCloseTermsModal}
      />

      {/* CHANGE VOTINGG TYPE MODAL */}
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

