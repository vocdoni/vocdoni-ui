import { atom } from "recoil"
import { AccountsSelector } from "recoil/selectors/accounts"

export const AccountsState = atom({
  key: "accounts",
  default: AccountsSelector,
})
