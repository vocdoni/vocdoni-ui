import React, { useState } from 'react'
// import styled from 'styled-components'
import { PageCard } from '../../components/cards'

import { INewVoteStepNames, NewVoteSteps } from '../../components/NewVote/steps'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { UseVoteCreationProvider } from '../../hooks/vote-creation'
import i18n from '../../i18n'

const NewVote = () => {
  const [step, setStep] = useState<INewVoteStepNames>('NewVoteDetails')
  const StepComponent = NewVoteSteps[step].component

  return (
    <UseVoteCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <MainTitle>{i18n.t("vote.new_vote")}</MainTitle>
            <MainDescription>{i18n.t("vote.enter_the_details_of_the_organization")}</MainDescription>
          </Column>
          <Column span={6}>
            <Steps
              steps={Object.values(NewVoteSteps).map(({ step }) => step)}
              activeIdx={Object.keys(NewVoteSteps).findIndex((name) => name === step)}
            />
          </Column>
          <Column span={12}>
            <StepComponent setStep={setStep} />
          </Column>
        </Grid>
      </PageCard>
    </UseVoteCreationProvider>
  )
}

export default NewVote
