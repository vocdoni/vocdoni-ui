import { EntityMetadata, ProcessSummary, MultiLanguage, ProcessMetadata, ProcessResultsSingleChoice } from 'dvote-js'
import { ProcessCensusOrigin, IProcessCensusOrigin } from 'dvote-solidity'
// IndexDB types
export enum AccountStatus {
  Wallet,
  Media,
  BalanceRequested,
  Balance,
  Metadata,
  Ready
}


export type CensusPoof = {
  censusValue: Uint8Array
  siblings: Uint8Array
  weight: string
}


export enum VotingType{
  Normal = ProcessCensusOrigin.OFF_CHAIN_TREE,
  Weighted = ProcessCensusOrigin.OFF_CHAIN_TREE_WEIGHTED,
  // TODO add anonymous Voting
  Anonymous = -1,
}


export interface IProcessResults extends ProcessResultsSingleChoice {
  totalWeightedVotes?: number
}

export type Account = {
  name: string,
  encryptedMnemonic: string,
  hdPath?: string,
  locale?: string
  address: string,
  hasBackup?: boolean,
  status?: AccountStatus,
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


export interface IProcessesSummary {
  id: string
  summary: ProcessSummary
  metadata?: ProcessMetadata
}

export type Nullable<T> = T | null

// React Hook Stepper types

export type StepperFuncResult = { error?: string | Error, waitNext?: boolean }
export type StepperLoopFuncResult = { continueFrom: number, error?: string | Error }

/** A function that transforms the current state into a new one and returns whether the parent hook should break and wait before the next step */
export type StepperFunc = () => Promise<StepperFuncResult>

/** A function that transforms the current state into a new one and returns whether the parent hook should break and wait before the next step */
export type StepperLoopFunc = () => Promise<StepperLoopFuncResult>
