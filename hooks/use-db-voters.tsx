import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { VoterDb } from '../lib/storage'
import { Voter } from "../lib/types"
import i18n from '../i18n'

export interface DbVotersContext {
  dbVoters: Voter[],
  addVoter: (voter: Voter) => Promise<void>,
  addOrUpdateVoter: (voter: Voter) => Promise<void>,
  refreshVoters: () => Promise<void>,
  updateVoter: (voter: Voter) => Promise<void>,
  getVoter: (address: string, processId: string) => Voter
  error: string,
}

export const UseDbVotersContext = createContext<DbVotersContext>({ step: 0, methods: {} } as any)

export const useDbVoters = () => {
  const dbVotersCtx = useContext(UseDbVotersContext)

  if (dbVotersCtx === null) {
    throw new Error('useDbVoters() can only be used on the descendants of <UseDbVotersProvider />,')
  }
  return dbVotersCtx
}

export const UseDbVotersProvider = ({ children }: { children: ReactNode }) => {
  const [dbVoters, setDbAccounts] = useState<Voter[]>([])
  const [error, setError] = useState<string>()

  // Initial load
  useEffect(() => {
    loadVoters()
  }, [])

  const validateUniqueVoter = (voter: Voter) => {
    if (!voter) return Promise.reject(new Error("Empty voter"))
    else if (dbVoters.some(acc =>
      acc.processId.toLowerCase() === voter.processId.toLowerCase() &&
      acc.address.toLowerCase() === voter.address.toLowerCase()
    )) {
      return Promise.reject(new Error(i18n.t("errors.there_is_already_one_voter_with_the_same_name")))
    }
  }


  const loadVoters = () => {
    return refreshVoters()
      .catch(err => {
        setError(i18n.t("errors.please_ensure_no_incognito_mode"))
      })
  }

  // Force a DB load
  const refreshVoters = () => {
    const db = new VoterDb()
    return db.read().then(voters => {
      setDbAccounts(voters)
      setError(null)
    })
  }

  /** Adds a new voter to the local DB and refreshes the currently available list */
  const addVoter = (voter: Voter) => {
    if (!voter?.address || !voter?.processId ) throw new Error("Invalid parameters")

    const rejectedPromise = validateUniqueVoter(voter)
    if (rejectedPromise) return rejectedPromise

    const db = new VoterDb()
    return db.update(voter)
      .then(() => refreshVoters())
  }

  const updateVoter = (voter: Voter) => {
    if (!voter?.address || !voter?.processId ) throw new Error("Invalid parameters")

    const db = new VoterDb()
    return db.update(voter)
      .then(() => refreshVoters())
  }

  const addOrUpdateVoter = (voter: Voter) => {
    if (!voter?.address || !voter?.processId ) throw new Error("Invalid parameters")

    const temp = getVoter(voter.address, voter.processId)
    if (!temp) {
      return addVoter(voter)
    } else {
      return updateVoter(voter)
    }
  }



  const getVoter = (address: string, processId: string): Voter => (
    dbVoters.find(acc => acc.address.toLowerCase() == address.toLowerCase() &&  acc.processId.toLowerCase() == processId.toLowerCase())
  )

  const value = { dbVoters, addVoter, refreshVoters, addOrUpdateVoter, updateVoter, getVoter, error }

  return (
    <UseDbVotersContext.Provider value={value}>
      {children}
    </UseDbVotersContext.Provider>
  )
}
