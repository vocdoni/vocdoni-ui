import { ProcessContractParameters, ProcessMetadata } from 'dvote-js'
import { INewEntityStepNames } from "../components/Entities/steps"
import { INewVoteStepNames } from "../components/NewVote/steps"

export type Account = {
  name: string,
  address: string,
  encryptedMnemonic: string,
  hdPath?: string,
  locale?: string
}

export type ProcessInfo = {
  id: string,
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  tokenAddress: string
}

export type NewEntityStepProps = {
  setStep: (step: INewEntityStepNames) => void,
}

export type NewVoteStepProps = {
  setStep: (step: INewVoteStepNames) => void,
}
