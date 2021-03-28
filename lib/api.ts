import { GatewayPool, VotingApi } from "dvote-js"
import { ProcessInfo } from "./types"

// VOCDONI API wrappers

/** Fetches the process parameters and metadata for the given entity */
export async function getProcesses(
    entityId: string,
    pool: GatewayPool
): Promise<ProcessInfo[]> {
    try {
        const list = await getProcessList(entityId, pool);
        const allProcess = list.map((processId) =>
            getProcessInfo(processId, pool)
        );
        const allProcessesInformation = await Promise.allSettled(allProcess);
        const sanitizeProccesses = (p) => {
            if (p.status === "fulfilled") return p.value;
        };
        return allProcessesInformation.map(sanitizeProccesses);
    } catch (err) {
        if (err?.message?.includes("Key not found")) return [];
        throw err;
    }
}

export async function getProcessInfo(processId: string, pool: GatewayPool): Promise<ProcessInfo> {
    const [metadata, parameters] = await Promise.all([
        VotingApi.getProcessMetadata(processId, pool),
        VotingApi.getProcessParameters(processId, pool)
    ])

    return {
        metadata,
        parameters,
        id: processId, // pass-through to have the value for links
        tokenAddress: parameters.entityAddress.toLowerCase()
    }
}

/** Returns the list of process id's */
export async function getProcessList(entityId: string, pool: GatewayPool): Promise<string[]> {
    let result: string[] = []
    let from = 0

    while (true) {
        const processList = await VotingApi.getProcessList({ entityId, from }, pool)
        if (processList.length == 0) return result

        result = result.concat(processList.map(id => "0x" + id))
        from += processList.length
    }
}
