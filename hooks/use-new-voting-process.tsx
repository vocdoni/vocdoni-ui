import { useState } from 'react'
import {
  ProcessContractParameters,
  ProcessEnvelopeType,
  ProcessMetadata,
  ProcessMetadataTemplate,
  ProcessMode,
  INewProcessParams
} from 'dvote-js'


export const useNewVotingProcess = () => {
  const [id, setID] = useState<string>(null)
  const [address, setAddress] = useState<string>(null)
  const [metadata, setMetadata] = useState<ProcessMetadata>(JSON.parse(JSON.stringify(ProcessMetadataTemplate)))
  const [parameters, setParameters] = useState<INewProcessParams>(() => {
    const params = new ProcessContractParameters()
    const newParams: INewProcessParams = {...params,
      metadata,
      mode: new ProcessMode(ProcessMode.make({
        autoStart: true,
        interruptible: true,
      })),
      envelopeType : new ProcessEnvelopeType(ProcessEnvelopeType.make({ encryptedVotes: false })),
      paramsSignature: '0x000000000000000000000',
    }
    return newParams
  })

  return { id, parameters, metadata, address, setID, setParameters, setMetadata, setAddress  }

}
