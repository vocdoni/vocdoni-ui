import React, { ChangeEvent, Component, useRef, useState } from 'react'

import { useProcessCreation } from '../../hooks/process-creation'
import i18n from '../../i18n'

import { Column, Grid } from '../grid'
import { Button } from '../button'
import styled from 'styled-components'

import { ProcessCreationPageSteps } from '.'
import {
  OptionDateSelector,
  IProcessPeriod,
  RadioOptions,
  addOffsetToDate,
} from './options-date-selector'
import {
  OptionsResultsAvailability,
  ResultsAvailability,
} from './options-results-availability'
import { ProcessEnvelopeType } from 'dvote-js'
import { useScrollTop } from "@hooks/use-scroll-top"

export const FormOptions = () => {
  useScrollTop()
  const { startDate, endDate, parameters, methods, startRightAway} = useProcessCreation()
  const [invalidDate, setInvalidDate] = useState<boolean>(false)
  const periodRef = useRef<IProcessPeriod>()

  const valid = () => {
    return startDate && endDate && !invalidDate
  }

  const onSubmit = () => {
    if (periodRef.current.startOption === RadioOptions.StartNow) {
      const finalStart = addOffsetToDate(new Date(), 0, 0, 7)
      methods.setStartDate(finalStart)
      periodRef.current.start = finalStart
      methods.setStartRightAway(true)
    } else{
      methods.setStartRightAway(false)
    }

    methods.createProcess()
    methods.setPageStep(ProcessCreationPageSteps.CREATION)
  }

  const handleChangeDate = (period: IProcessPeriod, invalDate: boolean) => {
    periodRef.current = period
    setInvalidDate(invalDate)

    methods.setStartDate(periodRef.current.start)
    methods.setEndDate(periodRef.current.end)
  }

  const handleChangeAvailability = (availability: ResultsAvailability) => {
    if ((availability === ResultsAvailability.Live && parameters.envelopeType.hasEncryptedVotes) ||
      (availability === ResultsAvailability.End && !parameters.envelopeType.hasEncryptedVotes)) {
      let envelopeType = ProcessEnvelopeType.ENCRYPTED_VOTES ^ parameters.envelopeType.value
      methods.setEnvelopeType(new ProcessEnvelopeType(envelopeType))
    }
  }

  return (
    <Grid>
      <Column>
        <Grid>
          <Column md={6} sm={12}>
            <OptionDateSelector onChangeDate={handleChangeDate} />
          </Column>

          <Column md={6} sm={12}>
            <OptionsResultsAvailability onChange={handleChangeAvailability} />
          </Column>
        </Grid>
      </Column>

      <Column>
        <BottomDiv>
          <Button
            border
            onClick={() => methods.setPageStep(ProcessCreationPageSteps.CENSUS)}
          >
            {i18n.t('action.go_back')}
          </Button>
          <Button positive onClick={() => onSubmit()} disabled={!valid()}>
            {i18n.t('action.continue')}
          </Button>
        </BottomDiv>
      </Column>
    </Grid>
  )
}

const BottomDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
