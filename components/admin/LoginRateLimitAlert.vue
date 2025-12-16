<template>
  <v-alert
    v-if="isBlocked"
    type="warning"
    variant="tonal"
    class="mt-4"
    border="start"
  >
    <div class="text-body-2">
      Has superado el límite de intentos. Podrás intentarlo nuevamente en:
    </div>
    <div class="text-h6 font-weight-bold mt-1">
      {{ formatTime(remainingTime) }}
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import { useLoginRateLimitStore } from '~/stores/loginRateLimit'

const loginRateLimitStore = useLoginRateLimitStore()

const remainingTime = ref(0)
const countdownInterval = ref<number | null>(null)

const isBlocked = computed(() => loginRateLimitStore.isBlocked)

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const calculateRemainingSeconds = (): number => {
  if (!loginRateLimitStore.blockedUntil) return 0

  const now = new Date()
  const blockedUntilDate = new Date(loginRateLimitStore.blockedUntil)

  if (now >= blockedUntilDate) return 0

  return Math.ceil((blockedUntilDate.getTime() - now.getTime()) / 1000)
}

const updateRemainingTime = () => {
  const remaining = calculateRemainingSeconds()
  remainingTime.value = remaining

  if (remaining <= 0) {
    stopCountdown()
    loginRateLimitStore.clearBlock()
  }
}

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  // Actualizar inmediatamente
  updateRemainingTime()

  if (remainingTime.value > 0) {
    countdownInterval.value = window.setInterval(() => {
      updateRemainingTime()
    }, 1000)
  }
}

const stopCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

// Exponer método para iniciar el countdown desde el componente padre
defineExpose({
  startCountdown
})

onMounted(() => {
  if (loginRateLimitStore.isBlocked) {
    startCountdown()
  }
})

onUnmounted(() => {
  stopCountdown()
})
</script>
