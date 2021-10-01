import { selectorFamily } from "recoil";

import { AccountsState } from "@recoil/atoms/accounts";

import { Account, AccountStatus } from "@lib/types";
import { AccountDb } from '@lib/storage'

export const AccountSelector = selectorFamily<Account, string>({
  key: "accountSelector",
  get: (address) => ({get}): Account => {
    if (!address) return
    
    const accounts = get(AccountsState)
    const account = accounts.find(a => a.address === address && a.status === AccountStatus.Ready)

    return account
  },
  set: (address) => ({get, set}, account: Account) => {
    const accounts = get(AccountsState)
    const updatedAccount = accounts.map(iterateAccount => iterateAccount.address === address? account: iterateAccount)
    const db = new AccountDb()

    db.update(account)

    set(AccountsState, updatedAccount)

    return
  }
})

