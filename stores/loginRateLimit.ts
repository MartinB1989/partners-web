import { defineStore } from 'pinia'

interface LoginRateLimitState {
  blockedUntil: string | null
}

export const useLoginRateLimitStore = defineStore('loginRateLimit', {
  state: (): LoginRateLimitState => ({
    blockedUntil: null
  }),

  getters: {
    isBlocked: (state) => {
      if (!state.blockedUntil) return false

      const now = new Date()
      const blockedUntilDate = new Date(state.blockedUntil)

      return now < blockedUntilDate
    },

    remainingSeconds: (state) => {
      if (!state.blockedUntil) return 0

      const now = new Date()
      const blockedUntilDate = new Date(state.blockedUntil)

      if (now >= blockedUntilDate) return 0

      return Math.ceil((blockedUntilDate.getTime() - now.getTime()) / 1000)
    }
  },

  actions: {
    setBlockedUntil(timestamp: string) {
      // Agregar 5 minutos al timestamp recibido
      const blockedDate = new Date(timestamp)
      blockedDate.setMinutes(blockedDate.getMinutes() + 5)
      this.blockedUntil = blockedDate.toISOString()
    },

    clearBlock() {
      this.blockedUntil = null
    }
  },

  persist: true
})
