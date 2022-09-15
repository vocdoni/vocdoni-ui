import { ProcessDetails,VotingApi } from '@vocdoni/voting'
import { GatewayPool } from '@vocdoni/client'
import { ensure0x } from '@vocdoni/common'
import { BigNumber, providers } from 'ethers'
import { InvalidAddressError } from './validators/errors/invalid-address-error';
import { InvalidEthereumProviderError } from './validators/errors/invalid-ethereum-provider-error';
import { RetrieveGasTimeOutError } from './validators/errors/retrieve-gas-time-out-error';

// VOCDONI API wrappers

/** Fetches the process parameters and metadata for the given entity */
export async function getProcesses(
  entityId: string,
  pool: GatewayPool
): Promise<ProcessDetails[]> {
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

export async function getProcessInfo(processId: string, pool: GatewayPool): Promise<ProcessDetails> {
  return VotingApi.getProcess(processId, pool)
}

/* Get the processes id's from the archive */
const getArchiveProcessIdList = async (
  entityId: string,
  pool: GatewayPool
): Promise<string[]> => {
  return VotingApi.getProcessList({ fromArchive: true, entityId: entityId }, pool)
};

/* Get the processes id's from the gateway */
const getGwProcessIdList = async (
  entityId: string,
  from: number,
  pool: GatewayPool
): Promise<string[]> => {
  return VotingApi.getProcessList(
    { fromArchive: false, entityId: entityId, from },
    pool
  )
};

export async function getProcessList(entityId: string, pool: GatewayPool): Promise<string[]> {
  let from = 0;

  let result: string[] = await Promise.all([
    getArchiveProcessIdList(entityId, pool),
    getGwProcessIdList(entityId, from, pool),
  ]).then((result: string[][]) => {
    from += result[1].length;
    let mergeResult = result.flat(1).map(x => ensure0x(x))
    mergeResult = [...new Set(mergeResult)]
    return mergeResult;
  });

  if (from === 0) {
    // remove duplicate between archive and gateway
    result = [...new Set(result)]
    return result;
  }

  while (true) {
    const processList = await VotingApi.getProcessList(
      { fromArchive: false, entityId: entityId, from },
      pool
    );
    if (processList.length == 0)  {
      // remove duplicate between archive and gateway
      result = [...new Set(result)]
      return result
    }
    result = result.concat(processList.map(x => ensure0x(x)));
    from += processList.length;
  }
}

/** Waits until the given Ethereum address has funds to operate */
export async function waitForGas(address: string, provider: providers.Provider, retries: number = 50) {
  const requestInterval = 10000
  const maxMilliseconds = requestInterval * retries

  if (!address) throw new InvalidAddressError()
  else if (!provider) throw new InvalidEthereumProviderError()

  while (retries >= 0) {
    if ((await provider.getBalance(address)).gt(BigNumber.from(0))) {
      return true
    }

    await new Promise(r => setTimeout(r, requestInterval)) // Wait 2s
    retries--
  }

  throw new RetrieveGasTimeOutError(maxMilliseconds)
}
