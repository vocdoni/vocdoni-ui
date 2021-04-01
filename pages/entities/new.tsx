import React, { useEffect, useState } from 'react'

import Creation from '../../components/Entities/Creation'
import FormDetails from '../../components/Entities/FormDetails'
import FormPassword from '../../components/Entities/FormPassword'
import { Column, Grid } from '../../components/grid'
import { Steps } from '../../components/steps'
import { UseEntityCreationProvider } from '../../hooks/entity-creation'
import { colors } from '../../theme/colors'

const steps = {
  FormDetails: {
    component: FormDetails,
    step: 'Entity details',
  },
  FormPassword: {
    component: FormPassword,
    step: 'Entity credentials',
  },
  Creation: {
    component: Creation,
    step: 'Entity creation',
  }
}

const NewEntity = () => {
  const [step, setStep] = useState<string>('FormDetails')
  let StepComponent = steps[step].component

  return (
    <UseEntityCreationProvider>
      <Grid>
        <Column span={6}>
          <h1>New entity</h1>
          <span style={{ color: colors.textAccent1 }}>
            Enter the details of the organization
          </span>
        </Column>
        <Column span={6}>
          <Steps
            steps={Object.values(steps).map(({ step }) => step)}
            activeIdx={Object.keys(steps).findIndex((name) => name === step)}
          />
        </Column>
        <Column span={12}>
          <StepComponent setStep={setStep} />
        </Column>
      </Grid>
    </UseEntityCreationProvider>
  )
}

export default NewEntity
