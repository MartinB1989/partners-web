<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Header Section -->
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-6 ga-3">
          <div class="flex-grow-1">
            <h1 class="text-h4 font-weight-bold mb-2">Métodos de Pago - Vinculaciones</h1>
            <p class="text-body-1 text-medium-emphasis">
              Vincula tus métodos de pago para poder recibir pagos de tus clientes.
              Al vincular Mercado Pago, podrás procesar pagos de forma segura y recibir el dinero directamente en tu cuenta.
            </p>
          </div>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            to="/admin/panel"
            class="flex-sm-shrink-0"
          >
            Atrás
          </v-btn>
        </div>

        <!-- Payment Methods Grid -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-card
              elevation="2"
              :border="isMercadoPagoLinked ? 'md success' : undefined"
              hover
              class="h-100"
            >
              <v-card-text class="d-flex flex-column align-center pa-6 text-center">
                <!-- Logo -->
                <v-sheet
                  class="d-flex align-center justify-center mb-6"
                  color="transparent"
                  height="100"
                  width="100%"
                >
                  <v-img
                    src="/static/images/mercadopago-logo.webp"
                    alt="Mercado Pago"
                    max-width="200"
                    contain
                  />
                </v-sheet>

                <!-- Title and Description -->
                <h3 class="text-h6 font-weight-bold mb-2">Mercado Pago</h3>
                <p class="text-body-2 text-medium-emphasis mb-6">
                  Acepta pagos con tarjetas de crédito, débito y otros medios de pago
                </p>

                <!-- Status Chip -->
                <v-chip
                  :color="isMercadoPagoLinked ? 'success' : 'warning'"
                  :prepend-icon="isMercadoPagoLinked ? 'mdi-check-circle' : 'mdi-alert-circle'"
                  variant="flat"
                  class="mb-6"
                >
                  {{ isMercadoPagoLinked ? 'Vinculado' : 'No vinculado' }}
                </v-chip>

                <!-- Action Button -->
                <v-btn
                  v-if="!isMercadoPagoLinked"
                  color="primary"
                  block
                  size="large"
                  prepend-icon="mdi-link-variant"
                  to="/admin/payment-methods/mercadopago"
                >
                  Vincular cuenta
                </v-btn>

                <v-btn
                  v-else
                  color="error"
                  variant="outlined"
                  block
                  size="large"
                  prepend-icon="mdi-link-variant-off"
                  :loading="isUnlinking"
                  @click="showUnlinkDialog = true"
                >
                  Desvincular
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Unlink Confirmation Dialog -->
    <v-dialog v-model="showUnlinkDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5 font-weight-bold">
          Confirmar desvinculación
        </v-card-title>

        <v-card-text class="text-body-1">
          ¿Estás seguro de que deseas desvincular tu cuenta de Mercado Pago?
          No podrás recibir pagos hasta que vuelvas a vincular una cuenta.
        </v-card-text>

        <v-card-actions class="px-4 pb-4">
          <v-spacer />
          <v-btn
            variant="text"
            :disabled="isUnlinking"
            @click="showUnlinkDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            :loading="isUnlinking"
            @click="unlinkMercadoPago"
          >
            Desvincular
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'

definePageMeta({
  layout: 'admin',
})

const alertStore = useAlertStore()

const isMercadoPagoLinked = ref<boolean>(false)
const isUnlinking = ref<boolean>(false)
const showUnlinkDialog = ref<boolean>(false)

// Función para verificar si Mercado Pago está vinculado
const checkMercadoPagoStatus = async (): Promise<void> => {
  try {
    // TODO: Implementar llamada al backend para verificar vinculación
    // const { data, error } = await usePaymentMethods().getMercadoPagoStatus()
    // isMercadoPagoLinked.value = data?.isLinked || false

    // Por ahora, simulamos que no está vinculado
    isMercadoPagoLinked.value = false
  } catch (error) {
    console.error('Error al verificar estado de Mercado Pago:', error)
  }
}

// Función para desvincular Mercado Pago
const unlinkMercadoPago = async (): Promise<void> => {
  isUnlinking.value = true
  try {
    // TODO: Implementar llamada al backend para desvincular
    // const { error } = await usePaymentMethods().unlinkMercadoPago()
    // if (error) {
    //   alertStore.showAlert('Error al desvincular Mercado Pago', 'error')
    // } else {
    //   alertStore.showAlert('Mercado Pago desvinculado correctamente', 'success')
    //   isMercadoPagoLinked.value = false
    // }

    alertStore.showAlert('Funcionalidad en desarrollo', 'info')
    showUnlinkDialog.value = false
  } catch (error) {
    console.error('Error al desvincular Mercado Pago:', error)
    alertStore.showAlert('Error al desvincular Mercado Pago', 'error')
  } finally {
    isUnlinking.value = false
  }
}

// Verificar estado al montar el componente
onMounted(() => {
  checkMercadoPagoStatus()
})
</script>

