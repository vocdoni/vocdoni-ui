import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { HelpText } from '@components/blocks/help-text'
import { Typography, TypographyVariant } from '@components/elements/typography'
import DateTimePicker from 'react-rainbow-components/components/DateTimePicker'
import styled from 'styled-components'
import { colors } from 'theme/colors'

import { Column, Grid } from '@components/elements/grid'
import { Radio } from '@components/elements/radio'
import { SectionText, SectionTitle, TextSize } from '@components/elements/text'

export interface IProcessPeriod {
  start: Date
  end: Date
  startOption: RadioOptions
}

interface IOptionDateSelectorProps {
  onChangeDate: (processDate: IProcessPeriod, invalidDate: boolean) => void
}

export enum RadioOptions {
  StartDelayed = 'delayed',
  StartNow = 'now',
}

export const addOffsetToDate = (
  date: Date,
  days = 0,
  hours = 0,
  minutes = 0
): Date => {
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

const MIN_DELAY_TIME = 10

export const OptionDateSelector = ({
  onChangeDate,
}: IOptionDateSelectorProps) => {
  const { i18n } = useTranslation()
  const [startDate, setStartDate] = useState<Date>(() =>
    addOffsetToDate(new Date(), 0, 1)
  )
  const [endDate, setEndDate] = useState<Date>(() =>
    addOffsetToDate(new Date(), 7)
  )
  const [invalidStartDate, setInvalidStartDate] = useState<boolean>(false)
  const [startOption, setStatOptions] = useState<RadioOptions>(
    RadioOptions.StartDelayed
  )

  useEffect(() => {
    if (startOption === RadioOptions.StartNow) {
      setStartDate(addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME + 1))
    }
  }, [startOption])

  useEffect(() => {
    const invalidDate =
      startDate.getTime() <
      addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME - 1).getTime()

    setInvalidStartDate(invalidDate)

    if(endDate < startDate) {
      setEndDate(addOffsetToDate(new Date(startDate), 7))
    }

    onChangeDate(
      {
        start: startDate,
        end: endDate,
        startOption,
      },
      invalidDate
    )
  }, [startDate, endDate])

  return (
    <Grid>
      <Column>
        <SectionTitle>
          {i18n.t('vote.start_date')}
          <HelpText text={i18n.t('vote.start_date_explanation')} />
        </SectionTitle>
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
            error={invalidStartDate}
            minDate={addOffsetToDate(new Date(), 0, 0, MIN_DELAY_TIME)}
            onChange={(value) => setStartDate(value)}
            disabled={startOption === RadioOptions.StartNow}
          />
          {invalidStartDate && (
            <Typography variant={TypographyVariant.Small} color={colors.danger}>
              {i18n.t('vote.the_process_must_start_at_least_20_minutes_latter')}
            </Typography>
          )}
        </CalendarContainer>
      </Column>

      <Column>
        <SectionTitle>
          {i18n.t('vote.end_date')}
          <HelpText text={i18n.t('vote.end_date_explanation')} />
        </SectionTitle>
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

const CalendarContainer = styled.div``
const DateSelectContainer = styled.div`
  display: flex;
  flex-wrap: wrap;

  & > label {
    margin-right: 16px;
  }
`
