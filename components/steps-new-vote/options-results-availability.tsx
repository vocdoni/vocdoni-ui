import React, { useState } from 'react'

import styled from 'styled-components'
import i18n from '../../i18n'
import { colors } from '../../theme/colors'

import { Button } from '../button'
import { Column, Grid } from '../grid'
import { SectionText, SectionTitle } from '../text'

export enum ResultsAvailability {
  Live = 'live',
  End = 'end',
}

interface IOptionsResultsAvailabilityProps {
  onChange: (availability: ResultsAvailability) => void
}

export const OptionsResultsAvailability = ({
  onChange,
}: IOptionsResultsAvailabilityProps) => {
  const [
    resultAvailability,
    setResultAvailability,
  ] = useState<ResultsAvailability>(ResultsAvailability.Live)

  const handleChange = (result: ResultsAvailability) => {
    setResultAvailability(result)
    onChange(result)
  }

  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.results_availability')}</SectionTitle>

        <SectionText>
          {i18n.t('vote.select_whether_results_should_be_visible_in_real_time')}
        </SectionText>
      </Column>

      <Column>
        <ButtonsContainer>
          <>
            <Button
              onClick={() => handleChange(ResultsAvailability.Live)}
              verticalAlign
              border
              borderColor={
                resultAvailability === ResultsAvailability.Live
                  ? colors.accent1
                  : colors.lightBorder
              }
              width={204}
            >
              <ButtonIconContainer>
                <img
                  src="/images/vote/results-live.svg"
                  alt={i18n.t('vote.results_live')}
                />
              </ButtonIconContainer>
              <ButtonText>{i18n.t('vote.real_time_results')}</ButtonText>
            </Button>
          </>
          <>
            <Button
              onClick={() => handleChange(ResultsAvailability.End)}
              verticalAlign
              border
              borderColor={
                resultAvailability === ResultsAvailability.End
                  ? colors.accent1
                  : colors.lightBorder
              }
              width={204}
            >
              <ButtonIconContainer>
                <img
                  src="/images/vote/results-after.svg"
                  alt={i18n.t('vote.results_after')}
                />
              </ButtonIconContainer>
              <ButtonText>
                {i18n.t('vote.reveal_results_at_the_end')}
              </ButtonText>
            </Button>
          </>
        </ButtonsContainer>
      </Column>
    </Grid>
  )
}

const ButtonsContainer = styled.div`
  min-height: 250px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;

  & > div {
  }
`
const ButtonIconContainer = styled.div`
  & > img {
    margin: 20px auto 8px;
    max-width: 80px;
    width: 100%;
    height: 80px;
  }
`

const ButtonText = styled(SectionText)`
  height: 48px;
  text-align: center;
  margin: 10px 0 12px;
  white-space: break-spaces;
`
