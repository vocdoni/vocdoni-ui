import { atom } from 'recoil'
import { AsyncAction } from '@recoil/actions/async-action'

export type PreregisterData = {
  prove: string
}

export const preregisterProofState = atom<AsyncAction<PreregisterData>>({
  key: 'preregisterProofState',
  default: null,
})
