import { atom } from "recoil"
import { CensusPoof } from "@lib/types"

export const censusProofState = atom<CensusPoof>({
  key: "census-proof",
  default: undefined,
})
