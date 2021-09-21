import { atom } from "recoil";
import { entityRegistrySelector } from "@recoil/selectors/entity-registry";

export interface IEntityRegistryState {
  name: string,
  email: string,
  type: string,
  size: number,
  subscriptionId?: string,
  customerId?: string
}

export const entityRegistryState = atom({
  key: 'entityRegistry',
  default: entityRegistrySelector
})