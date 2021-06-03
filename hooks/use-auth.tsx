import { Wallet } from "@ethersproject/wallet"
import { NoCensusMemberError } from "@lib/validators/errors/no-census-member-error"
import { usePool } from "@vocdoni/react-hooks"
import { CensusOffChainApi, CensusOffchainDigestType } from "dvote-js"

interface IUseAuth {
  checkCensusProof: (censusRoot: string, key: string) => void
}

export const useAuth = (): IUseAuth => {
  const { poolPromise } = usePool()

  const checkCensusProof = async (censusRoot: string, key: string) => {
    try {
      const voterWallet = new Wallet(key)
  
      const digestedHexClaim = CensusOffChainApi.digestPublicKey(
        voterWallet.publicKey,
        CensusOffchainDigestType.RAW_PUBKEY
      )
  
      const pool = await poolPromise
  
      const censusProof = await CensusOffChainApi.generateProof(
        censusRoot,
        { key: digestedHexClaim },
        false,
        pool
      )
  
      if (!censusProof) throw new NoCensusMemberError()
    } catch (error) {
      throw new NoCensusMemberError()
    }
  }

  return {
    checkCensusProof
  }
}