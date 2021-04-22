import React from 'react'
import { PageCard } from '../../components/cards'

import { SendVotePageStep, SendVotePageStepTitles } from '../../components/steps-send-vote'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { useSendVote, UseSendVoteProvider } from '../../hooks/send-vote'
import i18n from '../../i18n'
import { UseProcessProvider } from '@vocdoni/react-hooks'


const NewEntity = () => {
  return (
    <UseProcessProvider>
      <UseSendVoteProvider>
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
              <SendVotePageStep />
            </Column>
          </Grid>
        </PageCard>
      </UseSendVoteProvider>
    </UseProcessProvider>
  )
}

const WizardSteps = () => {
  const stepTitles = Object.values(SendVotePageStepTitles)
  const { pageStep } = useSendVote()

  return <Steps steps={stepTitles} activeIdx={pageStep} showProgress={false} />
}

export default NewEntity
