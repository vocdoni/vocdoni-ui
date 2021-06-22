import React from 'react'

import { PageCard } from '@components/elements/cards'
import { ProcessCreationPageStep, ProcessCreationPageStepTitles } from '@components/pages/votes/new'
import { Column, Grid } from '@components/elements/grid'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Steps } from '@components/blocks/steps'
import { LayoutEntity } from '@components/pages/app/layout/entity'

import {  MainDescription } from '@components/elements/text'
import i18n from '@i18n'
import { UseProcessCreationProvider } from '@hooks/process-creation'
import { useProcessCreation } from '@hooks/process-creation'

// NOTE: This page uses a custom Layout. See below.

const NewVote = () => {
  return (
    <UseProcessCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <Typography variant={TypographyVariant.H1}>{i18n.t("vote.new_vote")}</Typography>
            <MainDescription>{i18n.t("vote.enter_the_details_of_the_proposal")}</MainDescription>
          </Column>
          <Column span={6}>
            <WizardSteps />
          </Column>
          <Column span={12}>
            <ProcessCreationPageStep />
          </Column>
        </Grid>
      </PageCard>
    </UseProcessCreationProvider>
  )
}

const WizardSteps = () => {
  const stepTitles = Object.values(ProcessCreationPageStepTitles)
  const { pageStep } = useProcessCreation()

  return <Steps steps={stepTitles} activeIdx={pageStep} showProgress={true} />
}

// Defining the custom layout to use
NewVote["Layout"] = LayoutEntity

export default NewVote
