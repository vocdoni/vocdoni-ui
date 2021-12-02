import {
  PreregisterData,
  preregisterProofState,
} from '@recoil/atoms/preregister-proof'
import { useSetRecoilState } from 'recoil'
import { AsyncAction } from './async-action'

export const useCensusActions = () => {
  const setRegisterProof = useSetRecoilState(preregisterProofState)

  const generateProof = async (
    processId: string,
    password: string
  ): Promise<void> => {
    const registerProofAction = AsyncAction.CreateLoadingValue<PreregisterData>(
      { prove: null }
    )

    setRegisterProof(registerProofAction)

    setTimeout(() => {
      setRegisterProof(registerProofAction.setValue({ prove: password }))
    }, 10000)
  }

  return {
    generateProof: generateProof,
  }
}
