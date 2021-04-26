import React from 'react'
import { PageCard } from '../../../components/cards'

import { VotingPageStep, VotingPageStepTitles } from '../../../components/steps-voting'
import { Column, Grid } from '../../../components/grid'
import { Steps } from '../../../components/steps'
import { MainTitle, MainDescription } from '../../../components/text'
import { useVoting, UseVotingProvider } from '../../../hooks/use-voting'
import i18n from '../../../i18n'


const VotePage = () => {
  return (
    <UseVotingProvider>
      <PageCard>
        <Grid>
          <Column span={5}>
            <MainTitle>{i18n.t("vote.participate_title")}</MainTitle>
            <MainDescription>{i18n.t("vote.participate_description")}</MainDescription>
          </Column>
          <Column span={7}>
            <WizardSteps />
          </Column>
          <Column span={12}>
            {/* The actual step is rendered here */}
            <VotingPageStep />
          </Column>
        </Grid>
      </PageCard>
    </UseVotingProvider>
  )
}

const WizardSteps = () => {
  const stepTitles = Object.values(VotingPageStepTitles)
  const { pageStep } = useVoting()

  return <Steps steps={stepTitles} activeIdx={pageStep} showProgress={false} />
}

export default VotePage
