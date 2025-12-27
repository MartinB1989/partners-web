import { defineStore } from 'pinia'
import type { AuthState, User, TokenResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
    user: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    hasRefreshToken: (state) => !!state.refreshToken,
  },

  actions: {
    setTokens(tokens: TokenResponse) {
      this.accessToken = tokens.accessToken
      this.refreshToken = tokens.refreshToken
      this.expiresIn = tokens.expiresIn
    },
    setUser(user: User) {
      this.user = user
    },
    updateAccessToken(accessToken: string) {
      this.accessToken = accessToken
    },
    clearAuth() {
      this.accessToken = null
      this.refreshToken = null
      this.expiresIn = null
      this.user = null
    },
    // Alias para mantener compatibilidad
    logout() {
      this.clearAuth()
    }
  },

  persist: true
})
