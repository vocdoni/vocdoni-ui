import { HelpText } from '@components/common/help-text'
import React, { useState, useEffect } from 'react'
import { DateTimePicker } from 'react-rainbow-components'
import styled from 'styled-components'

import i18n from '../../i18n'

import { Column, Grid } from '../grid'
import { Radio } from '../radio'
import { SectionText, SectionTitle, TextSize } from '../text'

export interface IProcessPeriod {
  start: Date
  end: Date
  startOption: RadioOptions
}

interface IOptionDateSelectorProps {
  onChangeDate: (processDate: IProcessPeriod) => void
}

export enum RadioOptions {
  StartDelayed = 'delayed',
  StartNow = 'now',
}

export const addOffsetToDate = (date: Date, days = 0, hours = 0, minutes = 0): Date => {
  if (days) {
    date.setDate(date.getDate() + days)
  }

  if (hours) {
    date.setHours(date.getHours() + hours)
  }

  if (minutes) {
    date.setMinutes(date.getMinutes() + minutes)
  }

  return date
}
export const OptionDateSelector = ({
  onChangeDate,
}: IOptionDateSelectorProps) => {
  const [startDate, setStartDate] = useState<Date>(() => addOffsetToDate(new Date(), 0, 0, 20))
  const [endDate, setEndDate] = useState<Date>(() => addOffsetToDate(new Date(), 7))
  const [startOption, setStatOptions] = useState<RadioOptions>(
    RadioOptions.StartDelayed
  )

  useEffect(() => {
    if (startOption === RadioOptions.StartNow) {
      setStartDate(addOffsetToDate(new Date(), 0, 0, 7))
    } else {
      setStartDate(addOffsetToDate(new Date(), 0, 0, 20))
    }
  }, [startOption])

  useEffect(() => {
    onChangeDate({
      start: startDate,
      end: endDate,
      startOption
    })
  }, [startDate, endDate])

  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.start_date')}<HelpText text={i18n.t('vote.start_date_explanation')}/></SectionTitle>
        <SectionText>
          {i18n.t('vote.define_the_timeframe_of_the_proposal')}
        </SectionText>

        <DateSelectContainer>

              <Radio
                checked={startOption === RadioOptions.StartDelayed}
                onClick={() => setStatOptions(RadioOptions.StartDelayed)}
                name={RadioOptions.StartDelayed}
              >
                <RadioText size={TextSize.Small}>
                  {i18n.t('vote.start_on_a_specific_date')}
                </RadioText>
              </Radio>

              <Radio
                checked={startOption === RadioOptions.StartNow}
                onClick={() => setStatOptions(RadioOptions.StartNow)}
                name={RadioOptions.StartNow}
              >
                <RadioText size={TextSize.Small}>
                  {i18n.t('vote.start_right_away_7_minutes_from_now')}
                </RadioText>
              </Radio>
        </DateSelectContainer>

        <CalendarContainer>
          <DateTimePicker
            value={startDate}
            minDate={addOffsetToDate(new Date(), 0, 0, 20)}
            onChange={(value) => setStartDate(value)}
            disabled={startOption === RadioOptions.StartNow}
          />
        </CalendarContainer>
      </Column>

      <Column>
        <SectionTitle>{i18n.t('vote.end_date')}<HelpText text={i18n.t('vote.end_date_explanation')}/></SectionTitle>
        <SectionText>
          {i18n.t('vote.the_vote_will_end_at_the_given_time')}
        </SectionText>

        <CalendarContainer>
          <DateTimePicker
            value={endDate}
            minDate={startDate}
            onChange={(value) => setEndDate(value)}
          />
        </CalendarContainer>
      </Column>
    </Grid>
  )
}

const RadioText = styled(SectionText)`
  white-space: nowrap;
`


const CalendarContainer = styled.div`
`
const DateSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > label {
    margin-right: 16px;
  }
`
