import { Question, VotingType,IProcessResults } from "@lib/types"
import { VoteStatus } from "@lib/util"
import { ProcessDetails } from "dvote-js"
import { Wallet } from "ethers"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useProcessWrapper } from "./use-process-wrapper"

export interface ProcessInfoContext {
  processInfo: ProcessDetails
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
  results: IProcessResults
  title: string
  methods: {
    setProcessId: (processId: string) => void
    cancelProcess: (processId: string, wallet: Wallet) => Promise<void>
    pauseProcess: (processId: string, wallet: Wallet) => Promise<void>
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
    processInfo,
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
    questions,
    results,
    title,
    methods
  } = useProcessWrapper(processId)
  const value: ProcessInfoContext = {
    processInfo,
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
    results,
    title,
    methods: {
      setProcessId,
      ...methods
    }
  }
  return (
    <UseProcessInfoContext.Provider value={value}>
      {children}
    </UseProcessInfoContext.Provider>
  )
}
