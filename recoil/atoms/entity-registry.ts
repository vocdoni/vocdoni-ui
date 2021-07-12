import { atom } from "recoil";
import { entityRegistrySelector } from "recoil/selectors/entity-registry";

export interface IEntityRegistryState {
  name: string,
  email: string,
  type: string,
  size: string
}

export const entityRegistryState = atom({
  key: 'entityRegistry',
  default: entityRegistrySelector
})