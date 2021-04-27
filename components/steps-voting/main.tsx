import React, { ChangeEvent, Component, useState } from 'react'
import { Checkbox } from '@aragon/ui'

import FileLoader from '../FileLoader'
import { useProcessCreation } from '../../hooks/process-creation'
import { Column, Grid } from '../grid'
import { Input, Textarea } from '../inputs'
import { checkValidProcessMetadata } from "dvote-js"
import i18n from '../../i18n'
import { Button } from '../button'
import styled from 'styled-components'
import { SectionTitle } from '../text'
import { VotingPageSteps } from '.'
import { useMessageAlert } from '../../hooks/message-alert'
import { useVoting } from '../../hooks/use-voting'

const VotingPage = () => {
  const {
    pageStep,
    actionStep,
    pleaseWait,
    actionError,
    loadingInfoError,
    invalidProcessId,
    loadingInfo,
    refreshingVotedStatus,
    processInfo,

    hasStarted,
    hasEnded,

    canVote,
    remainingTime,
    allQuestionsChosen,
    statusText,

    results,

    methods
  } = useVoting()

  return (
    <Grid>
      <Column>
        <SectionTitle>{i18n.t('vote.voting')}</SectionTitle>
      </Column>
      <Column>
        {/* TODO */}
      </Column>
      <Column>
        <BottomDiv>
          <div /> {/* left space holder */}
          <div>
            <Button
              negative
            // onClick={onPreview}
            >
              {i18n.t("action.preview_proposal")}
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button
              positive
            // onClick={onContinue}
            // disabled={!hasCompleteMetadata()}
            >
              {i18n.t("action.continue")}
            </Button>
          </div>
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

export default VotingPage
