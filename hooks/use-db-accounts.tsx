import { useState, useEffect, useContext, createContext, ReactNode } from 'react'
import { AccountDb } from '../lib/storage'
import { Account } from "../lib/types"
import i18n from '../i18n'

export interface DbAccountsContext {
  dbAccounts: Account[],
  addDbAccount: (account: Account) => Promise<void>,
  refreshAccounts: () => Promise<void>,
  updateAccount: (address: string, account: Account) => Promise<void>,
  getAccount: (address: string) => Account
  error: string,
}

export const UseDbAccountsContext = createContext<DbAccountsContext>({ step: 0, methods: {} } as any)

export const useDbAccounts = () => {
  const dbAccountsCtx = useContext(UseDbAccountsContext)

  if (dbAccountsCtx === null) {
    throw new Error('useDbAccounts() can only be used on the descendants of <UseDbAccountsProvider />,')
  }
  return dbAccountsCtx
}

export const UseDbAccountsProvider = ({ children }: { children: ReactNode }) => {
  const [dbAccounts, setDbAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string>()

  // Initial load
  useEffect(() => {
    refreshAccounts()
  }, [])

  // Force a DB load
  const refreshAccounts = () => {
    const db = new AccountDb()
    return db.read().then(accounts => {
      setDbAccounts(accounts)
      setError(null)
    }).catch(err => {
      setError(i18n.t("errors.please_ensure_no_incognito_mode"))
    })
  }

  /** Adds a new account to the local DB and refreshes the currently available list */
  const addDbAccount = (account: Account) => {
    if (!account) Promise.reject(new Error("Empty account"))

    const db = new AccountDb()
    return db.write(dbAccounts.concat([account]))
      .then(() => refreshAccounts())
  }

  const updateAccount = (address: string, account: Account) => {
    if (!address || !account || !account.name || !account.encryptedMnemonic) throw new Error("Invalid parameters")
    console.log(JSON.stringify(account));
    
    const db = new AccountDb()
    return db.update(address, account)
      .then(() => refreshAccounts())
  }

  const getAccount = (address: string): Account => (
    dbAccounts.find(acc => acc.address.toLowerCase() == address.toLowerCase())
  )

  const value = { dbAccounts, addDbAccount, refreshAccounts, updateAccount, getAccount, error }

  return (
    <UseDbAccountsContext.Provider value={value}>
      {children}
    </UseDbAccountsContext.Provider>
  )
}
