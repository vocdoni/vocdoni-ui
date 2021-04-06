import { ProcessContractParameters, ProcessEnvelopeType, ProcessMetadata, ProcessMetadataTemplate, ProcessMode } from 'dvote-js'
import { createContext, useContext, useState } from 'react'
import { forceUpdate } from "../hooks/force-update"

export interface VoteCreationContext {
  metadata: ProcessMetadata
  parameters: ProcessContractParameters
  methods: {
    setTitle: (title: string) => void
    setDescription: (description: string) => void
    setMode: (mode: ProcessMode) => void
  }
}

export const UseVoteCreationContext = createContext<VoteCreationContext>({} as any)

export const useVoteCreation = () => {
  const voteCtx = useContext(UseVoteCreationContext)
  if (voteCtx === null) {
    throw new Error('useAccount() can only be used on the descendants of <UseVoteCreationProvider />,')
  }

  return voteCtx
}

export const UseVoteCreationProvider = ({ children }) => {
  const [metadata, setMetadata] = useState(() => JSON.parse(JSON.stringify(ProcessMetadataTemplate)))
  const [parameters, setParameters] = useState(() => {
    const defValue = new ProcessContractParameters()
    defValue.mode = new ProcessMode(ProcessMode.make({ autoStart: true }))
    defValue.envelopeType = new ProcessEnvelopeType(ProcessEnvelopeType.make({ encryptedVotes: false }))
    return defValue
  })

  // meta
  const setTitle = (title: string) => {
    setMetadata({ ...metadata, title })
  }
  const setDescription = (description: string) => {
    setMetadata({ ...metadata, description })
  }
  // TODO: complete

  // params (we need to use forceUpdate, since the reference cannot be changed unless creating a new instance and copying everything)
  const setMode = (mode: ProcessMode) => {
    if (parameters.mode == mode) return
    parameters.mode = mode
    forceUpdate()
  }
  // TODO: complete

  const value = {
    metadata, parameters, methods: {
      setTitle,
      setDescription,
      setMode
    }
  }

  return (
    <UseVoteCreationContext.Provider value={value}>
      {children}
    </UseVoteCreationContext.Provider>
  )
}
