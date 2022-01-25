import { atom } from "recoil"
import { ZKCensusPoof } from "@lib/types"

export const ZKcensusProofState = atom<ZKCensusPoof>({
  key: "zk-census-proof",
  default: undefined,
})
