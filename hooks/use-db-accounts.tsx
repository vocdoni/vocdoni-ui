import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from 'react'
import { AccountDb } from '../lib/storage'
import { Account } from '../lib/types'
import i18n from '../i18n'

export interface DbAccountsContext {
  dbAccounts: Account[]
  addDbAccount: (account: Account) => Promise<void>
  refreshAccounts: () => Promise<void>
  updateAccount: (account: Account) => Promise<void>
  getAccount: (address: string) => Account
  error: string
}

export const UseDbAccountsContext = createContext<DbAccountsContext>({
  step: 0,
  methods: {},
} as any)

export const useDbAccounts = () => {
  const dbAccountsCtx = useContext(UseDbAccountsContext)

  if (dbAccountsCtx === null) {
    throw new Error(
      'useDbAccounts() can only be used on the descendants of <UseDbAccountsProvider />,'
    )
  }
  return dbAccountsCtx
}

export const UseDbAccountsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const [dbAccounts, setDbAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string>()

  // Initial load
  useEffect(() => {
    loadAccounts()
  }, [])

  const validateAccountName = (account: Account) => {
    if (!account) return Promise.reject(new Error('Empty account'))
    else if (
      dbAccounts.some(
        (acc) =>
          acc.name.trim().toLowerCase() == account.name.trim().toLowerCase() &&
          acc.address !== account.address
      )
    ) {
      return Promise.reject(
        new Error(
          i18n.t('errors.there_is_already_one_account_with_the_same_name')
        )
      )
    }
  }

  const loadAccounts = () => {
    return refreshAccounts().catch((err) => {
      debugger
      setError(i18n.t('errors.please_ensure_no_incognito_mode'))
    })
  }

  // Force a DB load
  const refreshAccounts = () => {
    const db = new AccountDb()
    return db.read().then((accounts) => {
      setDbAccounts(accounts)
      setError(null)
    })
  }

  /** Adds a new account to the local DB and refreshes the currently available list */
  const addDbAccount = (account: Account) => {
    const rejectedPromise = validateAccountName(account)

    if (rejectedPromise) return rejectedPromise

    if (dbAccounts.some((acc) => acc.address == account.address)) {
      return Promise.reject(
        new Error(
          i18n.t(
            'errors.there_is_already_one_account_with_the_same_credentials'
          )
        )
      )
    }

    const db = new AccountDb()
    return db.update(account).then(() => refreshAccounts())
  }

  const updateAccount = (account: Account) => {
    if (!account?.address || !account.name || !account.encryptedMnemonic)
      throw new Error('Invalid parameters')

    const rejectedPromise = validateAccountName(account)

    if (rejectedPromise) return rejectedPromise

    const db = new AccountDb()
    return db.update(account).then(() => refreshAccounts())
  }

  const getAccount = (address: string): Account =>
    dbAccounts.find((acc) => acc.address.toLowerCase() == address.toLowerCase())

  const value = {
    dbAccounts,
    addDbAccount,
    refreshAccounts,
    updateAccount,
    getAccount,
    error,
  }

  return (
    <UseDbAccountsContext.Provider value={value}>
      {children}
    </UseDbAccountsContext.Provider>
  )
}
