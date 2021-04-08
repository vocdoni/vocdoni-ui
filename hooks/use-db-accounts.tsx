import { useState, useEffect } from 'react'
import { AccountDb } from '../lib/storage'
import { Account } from "../lib/types"
import i18n from '../i18n'

export const useDbAccounts = () => {
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

    const db = new AccountDb()
    return db.update(address, account)
  }

  return { dbAccounts, addDbAccount, refreshAccounts, updateAccount, error }
}
