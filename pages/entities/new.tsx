import React, { useState } from 'react'
import styled from 'styled-components'
import { PageCard } from '../../components/cards'

import { INewEntityStepNames, NewEntitySteps } from '../../components/Entities/steps'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { MainTitle, MainDescription } from '../../components/text'
import { UseEntityCreationProvider } from '../../hooks/entity-creation'
import i18n from '../../i18n'

const NewEntity = () => {
  const [step, setStep] = useState<INewEntityStepNames>('NewEntityDetails')
  const StepComponent = NewEntitySteps[step].component

  return (
    <UseEntityCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <MainTitle>{i18n.t("entity.new_entity")}</MainTitle>
            <MainDescription>{i18n.t("entity.enter_the_details_of_the_organization")}</MainDescription>
          </Column>
          <Column span={6}>
            <Steps
              steps={Object.values(NewEntitySteps).map(({ step }) => step)}
              activeIdx={Object.keys(NewEntitySteps).findIndex((name) => name === step)}
            />
          </Column>
          <Column span={12}>
            <StepComponent setStep={setStep} />
          </Column>
        </Grid>
      </PageCard>
    </UseEntityCreationProvider>
  )
}

export default NewEntity
