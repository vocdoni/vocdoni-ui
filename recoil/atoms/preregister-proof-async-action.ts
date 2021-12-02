import { atom } from 'recoil'
import { AsyncAction } from '@recoil/actions/async-action'

export type PreregisterData = {
  prove: string
}

export const preregisterProofAtom = atom<AsyncAction<PreregisterData>>({
  key: 'preregisterProofAtom',
  default: null,
})
