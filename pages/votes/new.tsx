import React from 'react'
// import styled from 'styled-components'
import { PageCard } from '../../components/cards'

import { VoteCreationStep, VoteCreationStepTitles } from '../../components/steps-new-vote'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { UseVoteCreationProvider } from '../../hooks/vote-creation'
import i18n from '../../i18n'
import { useEntityCreation } from '../../hooks/entity-creation'

const NewVote = () => {
  return (
    <UseVoteCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <MainTitle>{i18n.t("vote.new_vote")}</MainTitle>
            <MainDescription>{i18n.t("vote.enter_the_details_of_the_organization")}</MainDescription>
          </Column>
          <Column span={6}>
            <WizardSteps />
          </Column>
          <Column span={12}>
            <VoteCreationStep />
          </Column>
        </Grid>
      </PageCard>
    </UseVoteCreationProvider>
  )
}

const WizardSteps = () => {
  const stepTitles = Object.values(VoteCreationStepTitles)
  const { step } = useEntityCreation()

  return <Steps steps={stepTitles} activeIdx={step} />
}

export default NewVote
