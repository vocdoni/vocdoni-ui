import { ProcessContractParameters, ProcessMetadata } from 'dvote-js'

export type Account = {
  name: string,
  address: string,
  encryptedPrivateKey: string,
  // TODO: Complete the fields
}

export type ProcessInfo = {
  id: string,
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  tokenAddress: string
}

export type StepProps = {
  setStep(step: string) => void,
}
