import { atom } from "recoil";
import { productsSelector } from "@recoil/selectors/products";
import { Product } from "models/Product";

export const productsState = atom<Product[]>({
  key: 'productsState',
  default: productsSelector
})