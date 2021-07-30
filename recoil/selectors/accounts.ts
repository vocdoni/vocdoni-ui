import { AccountDb } from "@lib/storage"
import { selector } from "recoil"

export const AccountsSelector = selector({
  key: "accountsSelector",
  get: async () => {
    const db = new AccountDb()
    const accounts = await db.read()

    return accounts;
  }
})