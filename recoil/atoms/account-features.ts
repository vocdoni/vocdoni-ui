import { accountFeaturesSelector } from "@recoil/selectors/account-features"
import { atomFamily } from "recoil"

export enum Features {
  CustomBranding = "custom_branding",
}

export const accountFeaturesState = atomFamily<Features[], string>({
  key: "accountFeatures",
  default: (accountId) => accountFeaturesSelector(accountId),
})