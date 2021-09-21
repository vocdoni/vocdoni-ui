import { atom } from "recoil"
import { AccountsSelector } from "@recoil/selectors/accounts"
import { Account } from "@lib/types"

export const AccountsState = atom<Account[]>({
  key: "accounts",
  default: AccountsSelector,
})
