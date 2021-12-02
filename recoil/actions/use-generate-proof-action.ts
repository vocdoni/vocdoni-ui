import { PreregisterData, preregisterProofAtom } from "@recoil/atoms/preregister-proof-async-action";
import { Wallet } from "dvote-js";
import { useSetRecoilState } from "recoil";
import { AsyncAction } from "./async-action";

export const useProofActions = () => {
  const setRegisterProof = useSetRecoilState(preregisterProofAtom)

  const generateProof = async (
    processId: string,
    password: string
  ): Promise<void> => {
    const registerProofAction = AsyncAction.CreateLoadingValue<PreregisterData>({prove: null})

    setRegisterProof(registerProofAction)

    setTimeout(() => {
      setRegisterProof(
        registerProofAction.setValue({prove: password})
      )
    }, 10000)
  }

  return {
    generateProof: generateProof
  }
}