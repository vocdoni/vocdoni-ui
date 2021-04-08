import React, { useState } from 'react'
// import styled from 'styled-components'
import { PageCard } from '../../components/cards'

import { VoteCreationStepComponents } from '../../components/new-vote/steps'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { UseVoteCreationProvider } from '../../hooks/vote-creation'
import i18n from '../../i18n'
import { useEntityCreation } from '../../hooks/entity-creation'

const NewVote = () => {
  const stepTitles = Object.values(VoteCreationStepComponents).map(({ stepTitle }) => stepTitle)

  return (
    <UseVoteCreationProvider>
      <PageCard>
        {(() => {
          const { step } = useEntityCreation()
          const StepComponent = VoteCreationStepComponents[step].component

          return <Grid>
            <Column span={6}>
              <MainTitle>{i18n.t("vote.new_vote")}</MainTitle>
              <MainDescription>{i18n.t("vote.enter_the_details_of_the_organization")}</MainDescription>
            </Column>
            <Column span={6}>
              <Steps
                steps={stepTitles}
                activeIdx={step}
              />
            </Column>
            <Column span={12}>
              <StepComponent />
            </Column>
          </Grid>
        })()}
      </PageCard>
    </UseVoteCreationProvider>
  )
}

export default NewVote
