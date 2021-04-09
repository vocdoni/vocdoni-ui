import { EntityMetadata, ProcessContractParameters, ProcessMetadata } from 'dvote-js'
import { EntityCreationSteps } from "../components/Entities/steps"
import { VoteCreationSteps } from "../components/NewVote/steps"

// IndexDB types

export type Account = {
  name: string,
  encryptedMnemonic: string,
  hdPath?: string,
  locale?: string
  address: string,
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
  tokenAddress: string
}
