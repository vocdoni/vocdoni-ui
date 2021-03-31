import React, { Component, useEffect, useState } from 'react'

import Creation from '../../components/Entities/Creation'
import FormDetails from '../../components/Entities/FormDetails'
import FormPassword from '../../components/Entities/FormPassword'
import { UseAccountProvider } from '../../hooks/account'

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
    <UseAccountProvider>
      <div>
        <h1>New entity</h1>
        <span>
          Enter the details of the organization
          <button onClick={() => setStep('FormPassword')}>asdasd</button>
        </span>
        <div>
          {
            Object.keys(steps).map((st) => {
              const current = steps[st]
              const active = st === step

              return <span style={{color: active ? 'red' : ''}}>{current.step}</span>
            })
          }
        </div>
      </div>
      <StepComponent setStep={setStep} />
    </UseAccountProvider>
  )
}

export default NewEntity
