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

  const updateCategory = async (id: number, name: string) => {
    const { data, error } = await api.request('PATCH', `/categories/${id}`, { name })
    return { data, error } as { data: Category, error: string | null }
  }

  const deleteCategory = async (id: number) => {
    const { data, error } = await api.request('DELETE', `/categories/${id}`)
    return { data, error } as { data: Category, error: string | null }
  }

  const filterCategories = async (params?: {
    level?: number;
    name?: string;
    idName?: string;
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.level) queryParams.append('level', params.level.toString())
    if (params?.name) queryParams.append('name', params.name)
    if (params?.idName) queryParams.append('idName', params.idName)

    const { data, error } = await api.request('GET', `/categories/filter?${queryParams.toString()}`)
    return { data, error } as { data: Category[], error: string | null }
  }

  return { getCategories, createCategory, filterCategories, updateCategory, deleteCategory }
}
