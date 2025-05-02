import { useApi } from '~/composables/useApi'
import type { Product } from '~/types/product'

export const useProducts = () => {
  const api = useApi()

  const createProduct = async (product: Product) => {
    const { data, error } = await api.request('POST', '/products', product)
    return { data, error }
  }

  return {
    createProduct
  }

}
