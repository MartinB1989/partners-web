<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card
      max-width="600"
      width="100%"
      elevation="4"
      class="pa-4"
    >
      <!-- Estado de carga -->
      <div v-if="loading" class="text-center py-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
          width="6"
        />
        <v-card-text class="text-h6 mt-4">
          Verificando integración con Mercado Pago...
        </v-card-text>
      </div>

      <!-- Estado de éxito -->
      <div v-else-if="success" class="text-center py-8">
        <v-icon
          icon="mdi-check-circle"
          color="success"
          size="80"
        />
        <v-card-title class="text-h5 mt-4">
          ¡Vinculación exitosa!
        </v-card-title>
        <v-card-text class="text-body-1">
          Tu cuenta de Mercado Pago se ha vinculado correctamente.
          Ya puedes recibir pagos a través de la plataforma.
        </v-card-text>
        <v-card-actions class="justify-center mt-4">
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            @click="navigateToPaymentMethods"
          >
            Ir a métodos de pago
          </v-btn>
        </v-card-actions>
      </div>

      <!-- Estado de error -->
      <div v-else-if="error" class="text-center py-8">
        <v-icon
          icon="mdi-alert-circle"
          color="error"
          size="80"
        />
        <v-card-title class="text-h5 mt-4">
          Error en la vinculación
        </v-card-title>
        <v-card-text class="text-body-1">
          {{ errorMessage || 'No se pudo completar la vinculación con Mercado Pago. Por favor, intenta nuevamente.' }}
        </v-card-text>
        <v-card-actions class="justify-center mt-4">
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            @click="navigateToPaymentMethods"
          >
            Volver a métodos de pago
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            @click="retryVerification"
          >
            Reintentar
          </v-btn>
        </v-card-actions>
      </div>

      <!-- Estado de parámetro faltante -->
      <div v-else class="text-center py-8">
        <v-icon
          icon="mdi-alert"
          color="warning"
          size="80"
        />
        <v-card-title class="text-h5 mt-4">
          Parámetros inválidos
        </v-card-title>
        <v-card-text class="text-body-1">
          No se encontró el código de autorización necesario para completar la vinculación.
        </v-card-text>
        <v-card-actions class="justify-center mt-4">
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            @click="navigateToPaymentMethods"
          >
            Volver a métodos de pago
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'admin',
})

const route = useRoute()
const router = useRouter()

// Estados
const loading = ref(false)
const success = ref(false)
const error = ref(false)
const errorMessage = ref('')

// Extraer el código de la URL
const authorizationCode = computed(() => route.query.code as string | undefined)

// Función para verificar la integración con Mercado Pago
const verifyMercadoPagoIntegration = async () => {
  if (!authorizationCode.value) {
    return
  }

  loading.value = true
  success.value = false
  error.value = false
  errorMessage.value = ''

  try {
    // TODO: Cuando el endpoint esté disponible, implementar la llamada a la API
    // const response = await useMercadoPago().verifyIntegration(authorizationCode.value)

    // Simulación temporal para desarrollo (remover cuando el endpoint esté listo)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Simular respuesta exitosa (cambiar esto por la llamada real)
    const simulateSuccess = false // Cambiar a false para probar el estado de error

    if (simulateSuccess) {
      success.value = true
    } else {
      throw new Error('Error en la verificación')
    }

  } catch (err) {
    error.value = true
    errorMessage.value = (err as Error)?.message || 'Error desconocido al verificar la integración'
  } finally {
    loading.value = false
  }
}

// Navegar a la página de métodos de pago
const navigateToPaymentMethods = () => {
  router.push('/admin/payment-methods')
}

// Reintentar la verificación
const retryVerification = () => {
  verifyMercadoPagoIntegration()
}

// Ejecutar la verificación al montar el componente
onMounted(() => {
  if (authorizationCode.value) {
    verifyMercadoPagoIntegration()
  }
})
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
</style>