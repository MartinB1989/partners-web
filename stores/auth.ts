import { defineStore } from 'pinia'

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface AuthState {
  token: string | null;
  user: User | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.roles.includes('ADMIN') || false,
    isProducer: (state) => state.user?.roles.includes('PRODUCTOR') || false,
    hasRole: (state) => (role: string) => state.user?.roles.includes(role) || false
  },

  actions: {
    setToken(token: string) {
      this.token = token
    },
    setUser(user: User) {
      this.user = user
    },
    logout() {
      this.token = null
      this.user = null
    }
  },

  persist: true
})
