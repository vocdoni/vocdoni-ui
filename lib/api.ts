import { IProcessInfo, GatewayPool, VotingApi } from 'dvote-js'
import { BigNumber, providers } from 'ethers'

// VOCDONI API wrappers

/** Fetches the process parameters and metadata for the given entity */
export async function getProcesses(
  entityId: string,
  pool: GatewayPool
): Promise<IProcessInfo[]> {
  try {
    const list = await getProcessList(entityId, pool);
    const allProcess = list.map((processId) =>
      getProcessInfo(processId, pool)
    );
    const allProcessesInformation = await Promise.allSettled(allProcess);
    const sanitizeProccesses = (p) => {
      if (p.status === 'fulfilled') return p.value;
    };
    return allProcessesInformation.map(sanitizeProccesses);
  } catch (err) {
    if (err?.message?.includes('Key not found')) return [];
    throw err;
  }
}

export async function getProcessInfo(processId: string, pool: GatewayPool): Promise<IProcessInfo> {
  const [metadata, parameters] = await Promise.all([
    VotingApi.getProcessMetadata(processId, pool),
    VotingApi.getProcessParameters(processId, pool)
  ])

  return {
    metadata,
    parameters,
    id: processId, // pass-through to have the value for links
    entity: parameters.entityAddress.toLowerCase()
  }
}

/** Returns the list of process id's */
export async function getProcessList(entityId: string, pool: GatewayPool): Promise<string[]> {
  let result: string[] = []
  let from = 0

  while (true) {
    const processList = await VotingApi.getProcessList({ entityId, from }, pool)
    if (processList.length == 0) return result

    result = result.concat(processList.map(id => '0x' + id))
    from += processList.length
  }
}

/** Waits until the given Ethereum address has funds to operate */
export async function waitForGas(address: string, provider: providers.Provider, retries: number = 50) {
  if (!address || !provider) throw new Error("Invalid parameters")

  while (retries >= 0) {
    if ((await provider.getBalance(address)).gt(BigNumber.from(0))) {
      return true
    }

    await new Promise(r => setTimeout(r, 2000)) // Wait 2s
    retries--
  }
  return false
}
