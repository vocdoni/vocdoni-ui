import { bufferToBigInt } from '@vocdoni/common'
import { AnonymousEnvelopeParams, CensusOnChainApi, Voting, VotingApi, ZkInputs, ZkSnarks } from 'dvote-js'

export async function anonymousVote(registerPass, choices, processId, processKeys, pool) {
  const secretKey = bufferToBigInt(Buffer.from(registerPass, "utf-8"))
  const state = await VotingApi.getProcessState(processId, pool)
  const censusProofZK = await CensusOnChainApi.generateProof(state.rollingCensusRoot, secretKey, pool)

  const circuitInfo = await VotingApi.getProcessCircuitInfo(processId, pool)
  const witnessGeneratorWasm = await VotingApi.fetchAnonymousWitnessGenerator(circuitInfo)
  const zKey = await VotingApi.fetchAnonymousVotingZKey(circuitInfo)

  // Prepare ZK Proof
  const nullifier = Voting.getAnonymousVoteNullifier(secretKey, processId)
  const { votePackage, keyIndexes } = Voting.packageVoteContent(choices, processKeys)

  const inputs: ZkInputs = {
    censusRoot: state.rollingCensusRoot,
    censusSiblings: censusProofZK.siblings,
    maxSize: circuitInfo.maxSize,
    keyIndex: censusProofZK.index,
    nullifier,
    secretKey: secretKey,
    processId: Voting.getSnarkProcessId(processId),
    votePackage
  }

  const zkProof = await ZkSnarks.computeProof(inputs, witnessGeneratorWasm, zKey)
  // Only for verifying
  // const vKey = await VotingApi.fetchAnonymousVotingVerificationKey(circuitInfo)
  // const verifyProof = await ZkSnarks.verifyProof(JSON.parse(Buffer.from(vKey).toString()), zkProof.publicSignals as any, zkProof.proof as any)

  zkProof.publicSignals = [nullifier.toString()]

  const envelopeParams: AnonymousEnvelopeParams = {
    votePackage,
    processId,
    zkProof,
    nullifier,
    circuitIndex: circuitInfo.index,
    encryptionKeyIndexes: keyIndexes
  }

  // Package and submit
  const envelope = Voting.packageAnonymousEnvelope(envelopeParams)

  const result = await VotingApi.submitEnvelope(envelope, null, pool)
  console.log("result:", result)
}
