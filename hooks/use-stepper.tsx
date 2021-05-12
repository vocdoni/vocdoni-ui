import { useEffect, useState } from 'react'
import { StepperFunc, StepperLoopFuncResult } from "../lib/types"

export function useStepper<T>(mainActionStepFuncs: StepperFunc[], initialPageStep: T) {
  const [pageStep, setPageStep] = useState<T>(() => initialPageStep)
  const [actionStep, setActionStep] = useState(0)
  const [pleaseWait, setPleaseWait] = useState(false)
  const [started, setStarted] = useState(false)
  const [creationError, setCreationError] = useState<string>()

  const cleanError = () => { if (creationError) setCreationError("") }
  const incActionStep = () => setActionStep(actionStep + 1)

  // Create a function to perform these steps iteratively, stopping when a break is needed or an error is found
  const actionStepper = makeStepperLoopFunction(mainActionStepFuncs, incActionStep)

  // Continuation callback
  const doMainActionSteps = () => {
    setPleaseWait(true)
    cleanError()
    if (!started) {
      // Allow useEffect to auto-continue later on
      setStarted(true)
    }

    // Run or continue the main action
    return actionStepper(actionStep)
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
    else if (!started) return // do not auto start if not previously invoked

    doMainActionSteps() // creationStep changed, continue
  }, [actionStep, creationError])

  return {
    /** The UI page that should be displayed among the wizard pages */
    pageStep,
    /** The current index of `mainActionStepFuncs` to be executed next */
    actionStep,
    /** Whether the UI should display a loading indicator */
    pleaseWait,
    /** The error message thrown (if any) by the latest operation executed */
    creationError,
    setPageStep,
    resetActionStep: () => setActionStep(0),
    forceActionStep: setActionStep,
    // setPleaseWait,
    // setCreationError,
    // cleanError,
    doMainActionSteps
  }
}

// HELPERS

/** Returns a function that attempts to iterate over the given operators sequentially and reports any corresponding events */
function makeStepperLoopFunction(operations: StepperFunc[], onNextActionStep: () => void) {
  return async (startIdx: number = 0): Promise<StepperLoopFuncResult> => {
    for (let i = startIdx; i < operations.length; i++) {
      try {
        const op = operations[i]
        const { error, waitNext } = await op()

        // Stop on failure or refresh needed
        if (error) return { continueFrom: i, error }
        else if (waitNext) {
          return { continueFrom: i + 1 }
        }

        // continue to the next step
        onNextActionStep()
      }
      catch (err) {
        return { continueFrom: i, error: err.message }
      }
    }
    return { continueFrom: operations.length } // DONE
  }
}
