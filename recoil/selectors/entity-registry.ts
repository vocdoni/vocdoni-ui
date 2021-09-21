import { selector } from "recoil";
import { backendState } from "recoil/atoms/backend";
import { walletState } from "recoil/atoms/wallet";

export const entityRegistrySelector = selector({
  key: 'entityRegistrySelector',
  dangerouslyAllowMutability: true,
  get: async ({get}) => {
    const wallet = get(walletState)
    const gateway = get(backendState)

    const entityRegistry = await gateway.sendRequest({
      method: 'getEntity'
    }, wallet)      

    // Remember remove me
    const subs = 'sub_1JbpLhDiJcunaZwgHXsPJS8s'
    const entity = {...entityRegistry.entity, subscriptionId: undefined}
    return entity
  },
})