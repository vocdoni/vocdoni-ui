import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { useProcessCreation } from '@hooks/process-creation'

import { Column, Grid } from '@components/elements/grid'
import { Button } from '@components/elements/button'

import { ProcessCreationPageSteps } from '.'
import {
  OptionDateSelector,
  RadioOptions,
  addOffsetToDate,
} from './options-date-selector'
import {
  OptionsResultsAvailability,
  ResultsAvailability,
} from './options-results-availability'
import { ProcessEnvelopeType } from 'dvote-js'
import { useScrollTop } from "@hooks/use-scroll-top"
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'
import { Card, Col, Row, Text, Button as ButtonV2, StyledCard, Input } from '@components/elements-v2'
import { colorsV2 } from '@theme/colors-v2'
import { theme } from '@theme/global'
import { Icon } from '@components/elements-v2/icons'
import { DateTimePicker } from '@components/blocks-v2'
import { RadioButtonGroup } from './components/radio-buttons'
import { SelectorButton } from './components/selector-button'
import { PreregisterTimeline } from './components/preregister-timeline'
import { DateSelector, IProcessPeriod, StartOptions } from './components/date-selector'
import { SectionTitle } from './components/section-title'


enum ResultsAvalilability {
  End = 'end',
  Live = 'live'
}
export const FormOptions = () => {
  useScrollTop()
  const { i18n } = useTranslation()
  const { startDate, endDate, parameters, methods, startRightAway, anonymousVoting } = useProcessCreation()
  const [invalidDate, setInvalidDate] = useState<boolean>(false)
  const [resultsAvailability, setResultsAvailability] = useState(ResultsAvailability.Live)
  const periodRef = useRef<IProcessPeriod>()
  const { trackEvent } = useRudderStack()

  const valid = () => {
    return startDate && endDate && !invalidDate && startDate < endDate
  }

  const onSubmit = () => {
    if (periodRef.current.startOption === StartOptions.Inmediatly) {
      const finalStart = addOffsetToDate(new Date(), 0, 0, 7)
      methods.setStartDate(finalStart)
      periodRef.current.start = finalStart
      methods.setStartRightAway(true)
    } else {
      methods.setStartRightAway(false)
    }

    methods.createProcess()
    trackEvent(TrackEvents.PROCESS_CREATION_WIZARD_BUTTON_CLICKED, { step: ProcessCreationPageSteps.CREATION })
    methods.setPageStep(ProcessCreationPageSteps.CREATION)
  }

  const handleChangeDate = (period: IProcessPeriod, invalDate: boolean) => {
    periodRef.current = period
    setInvalidDate(invalDate)

    methods.setStartDate(periodRef.current.start)
    methods.setEndDate(periodRef.current.end)
  }

  const resultsAvailabilityOptions = [
    {
      title: 'In Real-Time',
      subtitle: 'Show voting results as soon as the first vote is submited',
      value: ResultsAvalilability.Live
    },
    {
      title: 'After vote',
      subtitle: 'Show voting results only when the voting process is closed',
      value: ResultsAvalilability.End
    }
  ]
  const handleResultsAvailabilityChange = (availability: ResultsAvailability) => {
    setResultsAvailability(availability)
    if ((availability === ResultsAvailability.Live && parameters.envelopeType.hasEncryptedVotes) ||
      (availability === ResultsAvailability.End && !parameters.envelopeType.hasEncryptedVotes)) {
      methods.setEnvelopeType(new ProcessEnvelopeType(ProcessEnvelopeType.ENCRYPTED_VOTES ^ parameters.envelopeType.value))
    }
  }
  return (
    <>
      <Row gutter='4xl'>
        <Col xs={12}>
          <Row gutter='xl'>
            <Col xs={12}>
              <SectionTitle
                title={i18n.t('votes.new.calendar.title')}
                subtitle={i18n.t('votes.new.calendar.subtitle')}
                index={2}
              />
            </Col>
            <Col xs={12}>
              <DateSelector anonymousVoting={anonymousVoting} onChangeDate={handleChangeDate} />
            </Col>
          </Row>
        </Col>
        {/* RESULTS AVAILABILITY */}
        <Col xs={12}>
          <Row gutter='xl'>
            {/* TITLE */}
            <Col xs={12}>
              <SectionTitle
                title={i18n.t('votes.new.results_availability.title')}
                subtitle={i18n.t('votes.new.results_availability.subtitle')}
                index={2}
              />
            </Col>
            <Col xs={12}>
              <SelectorButton
                onClick={handleResultsAvailabilityChange}
                options={resultsAvailabilityOptions} // const items: Options[] =
                value={resultsAvailability}
              />
            </Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Row justify='space-between'>
            <Col xs={2}>
              <ButtonV2
                variant='white'
                onClick={() => methods.setPageStep(ProcessCreationPageSteps.CENSUS)}
              >
                {i18n.t('action.back')}
              </ButtonV2>
            </Col>
            <Col xs={2}>
              <ButtonV2 variant='primary' onClick={() => onSubmit()} disabled={!valid()}>
                {i18n.t('action.continue')}
              </ButtonV2>
            </Col>
          </Row>
        </Col>
      </Row >
    </>
  )
}

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid #374669;
  border-radius: 5px;
  background : #fff;
  align-items : center;
  overflow: hidden;
`
const StyledIcon = styled(Icon)`
// position:absolute;
// bottom:8px;
// left:10px;
// width:10px;
// height:10px;
`
const StyledInput = styled.input`
  height:20px;
  margin:0;
  padding-left: 30px;
  padding: 8px 12px;
  color: ${theme.blueText};
  border: 2px solid ${colorsV2.neutral[200]};
  &:focus{
    border: 2px solid ${theme.accent1};
    outline: none;
  }
  &::placeholder {
    color: ${colorsV2.neutral[300]};
  }
`
