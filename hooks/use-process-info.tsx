import { MetadataFields } from "@components/pages/votes/new/metadata"
import { Question, VotingType } from "@lib/types"
import { VoteStatus } from "@lib/util"
import { usePool } from "@vocdoni/react-hooks"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useProcessWrapper } from "./use-process-wrapper"

export interface ProcessInfoContext {
  censusSize: number
  totalVotes: number
  processId: string
  votingType: VotingType
  status: VoteStatus
  startDate: Date
  endDate: Date
  liveResults: boolean
  description: string
  liveStreamUrl: string
  discussionUrl: string
  attachmentUrl: string
  questions: Question[]
  methods: {
    setProcessId: (processId: string) => void
  }
}

const UseProcessInfoContext = createContext<ProcessInfoContext>({ censusSize: 0, processId: '', methods: {} } as any)

export const useProcessInfo = (processId: string) => {
  const ctx = useContext(UseProcessInfoContext)

  if (ctx === null) {
    throw new Error('useVoting() can only be used on the descendants of <UsevotingProvider />,')
  }
  useEffect(() => {
    if (!processId) return
    else if (ctx.processId == processId) return

    ctx.methods.setProcessId(processId)
  }, [processId])

  return ctx
}

export const UseProcessInfoProvider = ({ children }: { children: ReactNode }) => {
  const [processId, setProcessId] = useState("")
  const invalidProcessId = !processId.match(/^0x[0-9a-fA-F]{64}$/)
  useEffect(() => {
    if (invalidProcessId) return
  }, [processId])
  const {
    censusSize,
    votingType,
    startDate,
    totalVotes,
    endDate,
    liveResults,
    description,
    liveStreamUrl,
    discussionUrl,
    attachmentUrl,
    status,
    questions
  } = useProcessWrapper(processId)
  const value: ProcessInfoContext = {
    censusSize,
    processId,
    votingType,
    startDate,
    endDate,
    totalVotes,
    liveResults,
    description,
    liveStreamUrl,
    discussionUrl,
    attachmentUrl,
    status,
    questions,
    methods: {
      setProcessId
    }
  }
  return (
    <UseProcessInfoContext.Provider value={value}>
      {children}
    </UseProcessInfoContext.Provider>
  )
}
