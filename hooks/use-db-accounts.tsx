import { useState, useEffect } from 'react'
import { AccountDb } from '../lib/storage'
import { Account } from "../lib/types"
import i18n from '../i18n'

export const useDbAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string>()

  // Initial load
  useEffect(() => {
    refreshAccounts()
  }, [])

  // Force a DB load
  const refreshAccounts = () => {
    const db = new AccountDb()
    return db.read().then(accounts => {
      setAccounts(accounts)
      setError(null)
    }).catch(err => {
      setError(i18n.t("errors.please_ensure_no_incognito_mode"))
    })
  }

  /** Adds a new account to the local DB and refreshes the currently available list */
  const addAccount = (account: Account) => {
    if (!account) Promise.reject(new Error("Empty account"))

    const db = new AccountDb()
    return db.write(accounts.concat([account]))
      .then(() => refreshAccounts())
  }

  /** Retrieves an account by name or returns undefined */
  const getAccount = (name: string) => {
    const db = new AccountDb()
    return db.get(name)
  }

  return { accounts, addAccount, getAccount, refreshAccounts, error }
}
