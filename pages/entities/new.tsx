import React from 'react'
import { PageCard } from '../../components/cards'

import { EntityCreationPageStep, EntityCreationPageStepTitles } from '../../components/steps-entity-creation'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { useEntityCreation, UseEntityCreationProvider } from '../../hooks/entity-creation'
import i18n from '../../i18n'

const NewEntity = () => {
  return (
    <UseEntityCreationProvider>
      <PageCard>
        <Grid>
          <Column span={5}>
            <MainTitle>{i18n.t("process.new_process")}</MainTitle>
            <MainDescription>{i18n.t("process.enter_the_details_of_the_process")}</MainDescription>
          </Column>
          <Column span={7}>
            <WizardSteps />
          </Column>
          <Column span={12}>
            {/* The actual step is rendered here */}
            <EntityCreationPageStep />
          </Column>
        </Grid>
      </PageCard>
    </UseEntityCreationProvider>
  )
}

const WizardSteps = () => {
  const stepTitles = Object.values(EntityCreationPageStepTitles)
  const { pageStep } = useEntityCreation()

  return <Steps steps={stepTitles} activeIdx={pageStep} />
}

export default NewEntity
