import { EntityMetadata, ProcessSummary, MultiLanguage, ProcessMetadata, ProcessResultsSingleChoice } from 'dvote-js'
import { ProcessCensusOrigin, IProcessCensusOrigin } from 'dvote-solidity'
import { BigNumber } from 'ethers'
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
  siblings: string
  weight: bigint
}

export type ZKCensusPoof = {
  siblings: bigint[]
  index: bigint
}


export enum VotingType {
  Normal = ProcessCensusOrigin.OFF_CHAIN_TREE,
  Weighted = ProcessCensusOrigin.OFF_CHAIN_TREE_WEIGHTED,
  Anonymous = 3
}


export interface IProcessResults extends ProcessResultsSingleChoice {
  totalWeightedVotes?: BigNumber
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

export type Voter = {
  address: string,
  processId: string,
  loginData?: string,
  encrAnonKey ?: string
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
