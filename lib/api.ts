import { ProcessDetails, IGatewayClient, VotingApi } from 'dvote-js'
import { BigNumber, providers } from 'ethers'
import { InvalidAddressError } from './validators/errors/invalid-address-error';
import { InvalidEthereumProviderError } from './validators/errors/invalid-ethereum-provider-error';
import { RetrieveGasTimeOutError } from './validators/errors/retrieve-gas-time-out-error';

// VOCDONI API wrappers

/** Fetches the process parameters and metadata for the given entity */
export async function getProcesses(
  entityId: string,
  pool: IGatewayClient
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

export async function getProcessInfo(processId: string, pool: IGatewayClient): Promise<ProcessDetails> {
  return VotingApi.getProcess(processId, pool)
}

/** Returns the list of process id's */
export async function getProcessList(entityId: string, pool: IGatewayClient): Promise<string[]> {
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
