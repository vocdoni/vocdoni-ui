import { preregisterProofAtom } from '@recoil/atoms/preregister-proof-async-action'
import { walletState } from '@recoil/atoms/wallet'
import { Wallet } from 'dvote-js'
import { selectorFamily } from 'recoil'

export const preregisterProofGeneratorSelector = selectorFamily({
  key: 'preregisterProofGeneratorSelector',
  get:
    (processId) =>
    async ({ get }) => {
      return get(preregisterProofAtom)
    },
  set:
    (processId) =>
    ({ get, set }, password) => {
      console.log(processId)
      console.log('calling to the setter')
      const wallet = get(walletState)
      console.log('setting the password')

      setTimeout(() => {
        set(preregisterProofAtom, 'new value')
      }, 10000)
    },
})
