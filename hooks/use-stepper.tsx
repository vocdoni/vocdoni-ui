import { useEffect, useState } from 'react'
import { EntityCreationPageSteps } from '../components/steps-entity-creation'
import { makeStepperLoopFunction } from '../lib/util'
import { StepperFunc } from '../lib/types'


export const useStepper = (creationFuncs: StepperFunc[]) => {
  const [pageStep, setPageStep] = useState<EntityCreationPageSteps>(EntityCreationPageSteps.METADATA)
  const [actionStep, setActionStep] = useState(0)
  const [pleaseWait, setPleaseWait] = useState(false)
  const [creationError, setCreationError] = useState<string>()


  const cleanError = () => { if (creationError) setCreationError("") }
  // Create a function to perform these steps iteratively, stopping when a break is needed or an error is found
  const stepper = makeStepperLoopFunction(creationFuncs)


  // Continuation callback
  const executeNextStep = () => {
    setPleaseWait(true)
    cleanError()

    return stepper(actionStep)
      .then(({ continueFrom, error }) => {
        // Either the process is completed, something needs a refresh or something failed
        setPleaseWait(false)

        // Set the next step to continue from
        setActionStep(continueFrom)

        if (error) {
          setCreationError(error)
          // This will cause the `useEffect` below to stop relaunching `continueCreation`
          // until the caller manually invokes it again
        }
        // Otherwise, the `useEffect` below will relaunch `continueCreation` after
        // the new state is available
      })
  }

  useEffect(() => {
    if (creationError) return
    else if (pageStep < EntityCreationPageSteps.CREATION) return

    executeNextStep() // creationStep changed, continue
  }, [actionStep, creationError])

  return { pageStep, actionStep, pleaseWait, creationError, setPageStep, setActionStep, setPleaseWait, setCreationError, cleanError, executeNextStep }

}
