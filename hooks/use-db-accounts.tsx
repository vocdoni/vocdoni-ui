import i18next from 'i18next'
import { useState, useEffect } from 'react'
import { AccountDb } from '../lib/storage'
import { Account } from "../lib/types"

export const useDbAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<String>()

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
      setError(i18next.t("errors.please_ensure_no_incognito_mode"))
    })
  }

  /** Adds a new account to the local DB and refreshes the currently available list */
  const addAccount = (account: Account) => {
    if (!account) Promise.reject(new Error("Empty account"))

    const db = new AccountDb()
    return db.write(accounts.concat([account]))
      .then(() => refreshAccounts())
  }

  return { accounts, addAccount, refreshAccounts, error }
}
