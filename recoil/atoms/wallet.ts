import { Wallet } from "ethers";
import { atom } from "recoil";

export const walletState = atom<Wallet>({
  key: 'wallet',
  default: undefined
})