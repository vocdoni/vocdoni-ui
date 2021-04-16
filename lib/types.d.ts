import { EntityMetadata, ProcessContractParameters, ProcessMetadata } from 'dvote-js'

// IndexDB types

export type Account = {
  name: string,
  encryptedMnemonic: string,
  hdPath?: string,
  locale?: string
  address: string,
  backupMnemonic?: boolean,
  pending?: {
    creation: boolean,
    metadata: EntityMetadata,
    email: string
  }
}

// Shared types

export type ProcessInfo = {
  id: string,
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  entity: string
}

export type Nullable<T> = T | null

// React Hook Stepper types

export type StepperFuncResult = { error?: string, waitNext?: boolean }
export type StepperLoopFuncResult = { continueFrom: number, error?: string }

/** A function that transforms the current state into a new one and returns whether the parent hook should break and wait before the next step */
export type StepperFunc = () => Promise<StepperFuncResult>

/** A function that transforms the current state into a new one and returns whether the parent hook should break and wait before the next step */
export type StepperLoopFunc = () => Promise<StepperLoopFuncResult>
