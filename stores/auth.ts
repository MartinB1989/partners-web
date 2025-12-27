import { defineStore } from 'pinia'
import type { AuthState, User } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
  },

  actions: {
    setToken(token: string) {
      this.accessToken = token
    },
    setRefreshToken(refresh: string) {
      this.refreshToken = refresh
    },
    setUser(user: User) {
      this.user = user
    },
    logout() {
      this.accessToken = null
      this.user = null
    }
  },

  persist: true
})
