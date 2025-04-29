import { useApi } from '~/composables/useApi'
import type { LoginResponse } from '~/types/auth'

export function useAuth() {
  const api = useApi()

  const adminLogin = async (email: string, password: string) => {
    const { data, error } = await api.request<LoginResponse>('POST', '/auth/admin/login', { email, password })
    return { data, error }
  }

  return {
    adminLogin
  }
} 