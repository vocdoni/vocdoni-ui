import React from 'react'
import { PageCard } from '../../components/cards'

import { EntityCreationStepComponents } from '../../components/entity-creation/steps'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { useEntityCreation, UseEntityCreationProvider } from '../../hooks/entity-creation'
import i18n from '../../i18n'

const NewEntity = () => {
  const stepTitles = Object.values(EntityCreationStepComponents).map(({ stepTitle }) => stepTitle)

  return (
    <UseEntityCreationProvider>
      <PageCard>
        {(() => {
          const { step } = useEntityCreation()
console.log("STEP", step)
          const StepComponent = EntityCreationStepComponents[step].component

          return <Grid>
            <Column span={6}>
              <MainTitle>{i18n.t("entity.new_entity")}</MainTitle>
              <MainDescription>{i18n.t("entity.enter_the_details_of_the_organization")}</MainDescription>
            </Column>
            <Column span={6}>
              <Steps
                steps={stepTitles}
                activeIdx={step}
              />
            </Column>
            <Column span={12}>
              {/* The actual step is rendered here */}
              <StepComponent />
            </Column>
          </Grid>
        })()}
      </PageCard>
    </UseEntityCreationProvider>
  )
}

export default NewEntity
