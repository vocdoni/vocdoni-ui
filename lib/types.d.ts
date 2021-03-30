import { ProcessContractParameters, ProcessMetadata } from 'dvote-js'

export type ProcessInfo = {
  id: string,
  metadata: ProcessMetadata,
  parameters: ProcessContractParameters,
  tokenAddress: string
}
