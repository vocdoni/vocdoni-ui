import { EntityMetadata, MultiLanguage } from 'dvote-js'

// IndexDB types

export type Account = {
  name: string,
  encryptedMnemonic: string,
  hdPath?: string,
  locale?: string
  address: string,
  hasBackup?: boolean,
  pending?: {
    creation: boolean,
    metadata: EntityMetadata,
    email: string
  }
}

// Shared types

export type Question = {
  title: MultiLanguage<string>
  description?: MultiLanguage<string>
  choices: Choice[]
}

export type Choice = {
  title: MultiLanguage<string>
  value: number
}

export type Nullable<T> = T | null

// React Hook Stepper types

export type StepperFuncResult = { error?: string, waitNext?: boolean }
export type StepperLoopFuncResult = { continueFrom: number, error?: string }

/** A function that transforms the current state into a new one and returns whether the parent hook should break and wait before the next step */
export type StepperFunc = () => Promise<StepperFuncResult>

/** A function that transforms the current state into a new one and returns whether the parent hook should break and wait before the next step */
export type StepperLoopFunc = () => Promise<StepperLoopFuncResult>
