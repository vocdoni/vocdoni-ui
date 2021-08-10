import { AccountDb } from "@lib/storage"
import { Account } from "@lib/types"
import { selector } from "recoil"

export const AccountsSelector = selector<Account[]>({
  key: "accountsSelector",
  get: () => {
    const db = new AccountDb()

    return db.read();
  }
})