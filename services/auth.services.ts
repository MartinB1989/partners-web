import { useApi } from '~/composables/useApi'

const api = useApi()

export const authService = {
  adminLogin: async (email: string, password: string) => {
    const {data, error} = await api.request('POST', '/auth/admin/login', { email, password })
    return {data, error}
  }
}
