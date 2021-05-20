import React, { useEffect } from 'react'
// import styled from 'styled-components'
import { PageCard } from '../../components/cards'

import { ProcessCreationPageStep, ProcessCreationPageStepTitles } from '../../components/steps-new-vote'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { UseProcessCreationProvider } from '../../hooks/process-creation'
import i18n from '../../i18n'
import { useProcessCreation } from '../../hooks/process-creation'
import { useHelpCenter } from '@hooks/help-center'
import { LayoutEntity } from '@components/layout/entity'

// NOTE: This page uses a custom Layout. See below.

const NewVote = () => {
  const { show, hide } = useHelpCenter();

  useEffect(() => {
    show()

    return hide
  }, [])

  return (
    <UseProcessCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <MainTitle>{i18n.t("vote.new_vote")}</MainTitle>
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
