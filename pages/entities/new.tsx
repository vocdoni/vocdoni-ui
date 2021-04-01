import React, { useState } from 'react'
import { PageCard } from '../../components/cards'

import { INewEntitySteps, NewEntitySteps } from '../../components/Entities/steps'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { UseEntityCreationProvider } from '../../hooks/entity-creation'
import { colors } from '../../theme/colors'

const NewEntity = () => {
  const [step, setStep] = useState<INewEntitySteps>('NewEntityDetails')
  const StepComponent = NewEntitySteps[step].component

  return (
    <UseEntityCreationProvider>
      <PageCard>
        <Grid>
          <Column span={6}>
            <h1>New entity</h1>
            <span style={{ color: colors.textAccent1 }}>Enter the details of the organization</span>
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
