<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-4 ga-3">
          <div>
            <h1 class="text-h4 mb-2">Métodos de Pago - Vinculaciones</h1>
            <p class="text-body-2 text-medium-emphasis">
              Vincula tus métodos de pago para poder recibir pagos de tus clientes.
              Al vincular Mercado Pago, podrás procesar pagos de forma segura y recibir el dinero directamente en tu cuenta.
            </p>
          </div>
          <div class="d-flex flex-column flex-sm-row ga-2 buttons-container">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              class="action-btn"
              to="/admin/panel"
            >
              Atrás
            </v-btn>
          </div>
        </div>

        <v-row>
          <v-col cols="12" md="6" lg="4">
            <v-card
              class="payment-method-card"
              elevation="2"
              :class="{ 'linked': isMercadoPagoLinked }"
            >
              <v-card-text class="d-flex flex-column align-center pa-6">
                <div class="logo-container mb-4">
                  <v-img
                    src="/static/images/mercadopago-logo.webp"
                    alt="Mercado Pago"
                    max-width="200"
                    contain
                  />
                </div>

                <h3 class="text-h6 mb-2">Mercado Pago</h3>
                <p class="text-body-2 text-center text-medium-emphasis mb-4">
                  Acepta pagos con tarjetas de crédito, débito y otros medios de pago
                </p>

                <v-chip
                  v-if="isMercadoPagoLinked"
                  color="success"
                  prepend-icon="mdi-check-circle"
                  class="mb-4"
                >
                  Vinculado
                </v-chip>

                <v-chip
                  v-else
                  color="warning"
                  prepend-icon="mdi-alert-circle"
                  class="mb-4"
                >
                  No vinculado
                </v-chip>

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

    <!-- Modal de confirmación para desvincular -->
    <v-dialog v-model="showUnlinkDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar desvinculación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas desvincular tu cuenta de Mercado Pago?
          No podrás recibir pagos hasta que vuelvas a vincular una cuenta.
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="primary"
            variant="text"
            :disabled="isUnlinking"
            @click="showUnlinkDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            :loading="isUnlinking"
            :disabled="isUnlinking"
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

<style scoped>
.buttons-container {
  width: 100%;
}

@media (min-width: 600px) {
  .buttons-container {
    width: auto;
  }
}

.action-btn {
  width: 100%;
}

@media (min-width: 600px) {
  .action-btn {
    width: auto;
  }
}

.payment-method-card {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.payment-method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
}

.payment-method-card.linked {
  border-color: rgb(var(--v-theme-success));
}

.logo-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}
</style>
