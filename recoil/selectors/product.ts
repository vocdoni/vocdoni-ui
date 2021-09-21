import { selectorFamily } from 'recoil'

import { Product } from '@models/Product'
import { productsState} from '../atoms/products'

export const productSelector = selectorFamily<Product, string>({
  key: "productSelector",
  get: (productId: string) => async ({get}): Promise<Product> => {
    if (!productId) return

    const products = await get(productsState)

    return products.find(product => product.id === productId)
  }
})