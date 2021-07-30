import { Account, AccountStatus } from "@lib/types";
import { selectorFamily } from "recoil";
import { AccountsState } from "recoil/atoms/accounts";

export const AccountSelector = selectorFamily({
  key: "accountSelector",
  get: (address) => ({get}): Account => {
    const accounts = get(AccountsState)
    console.log('The accounts are 2')
    console.log(accounts)
    const account = accounts.find(a => a.address === address && a.status === AccountStatus.Ready)

    return account
  },
  set: (address) => ({set}, account) => {
    console.log('The account is ', account)
  }
})

