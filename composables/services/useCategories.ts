import { useApi } from '~/composables/useApi'
import type { Category } from '~/types/categories'

export const useCategories = () => {
  const api = useApi()

  const getCategories = async () => {
    const { data, error } = await api.request('GET', '/categories')
    return { data, error } as { data: Category[]	, error: string | null }
  }

  const createCategory = async (category: Category) => {
    const { data, error } = await api.request('POST', '/categories', category)
    return { data, error } as { data: Category, error: string | null }
  }

  return { getCategories, createCategory }
}
