import { AccountDb } from "@lib/storage"
import { Account } from "@lib/types"
import { selector } from "recoil"

export const AccountsSelector = selector<Account[]>({
  key: "accountsSelector",
  get: async () => {
    const db = new AccountDb()
    const accounts = await db.read()

    return accounts;
  }
})