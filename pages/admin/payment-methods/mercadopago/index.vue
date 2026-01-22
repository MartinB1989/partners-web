<template>
  <v-container class="px-4 px-sm-8 py-6">
    <v-row>
      <!-- Header Section -->
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-4 ga-3">
          <div>
            <h1 class="text-h4 text-sm-h3 font-weight-bold mb-2">Vinculación de pagos</h1>
            <v-divider class="border-opacity-100 bg-primary" style="max-width: 80px" thickness="4" />
          </div>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="() => router.back()"
          >
            Atrás
          </v-btn>
        </div>

        <v-card class="mt-6">
          <v-card-text class="d-flex align-start">
            <v-icon color="primary" size="24" class="mr-3 flex-shrink-0">mdi-information-outline</v-icon>
            <div class="text-body-1 text-medium-emphasis">
              Vincula tu cuenta de Mercado Pago para gestionar los ingresos de
              tus ventas de forma segura y automática.
              <br class="d-none d-sm-block">
              <span class="text-primary font-weight-medium">¿Ya tienes una cuenta vinculada?</span>
              Puedes desvincularla y conectar una nueva cuando lo necesites.
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Loading State -->
      <v-col v-if="loading" cols="12" class="d-flex justify-center align-center" style="min-height: 400px">
        <v-progress-circular indeterminate color="primary" size="64" />
      </v-col>

      <!-- Account Status Section -->
      <v-col v-else cols="12">
        <!-- CUENTA VINCULADA -->
        <v-card v-if="isLinked" class="elevation-4">
          <v-card-title class="d-flex align-center bg-grey-lighten-4">
            <v-icon color="success" size="24" class="mr-2">mdi-check-circle</v-icon>
            <span class="text-h6">Cuenta vinculada exitosamente</span>
          </v-card-title>

          <v-card-text class="pa-6">
            <div class="d-flex flex-column flex-sm-row align-center justify-space-between">
              <div class="d-flex flex-column flex-sm-row align-center">
                <v-sheet
                  class="rounded-lg pa-2 d-flex align-center justify-center"
                  color="orange-lighten-5"
                  width="100"
                  height="100"
                >
                  <v-img
                    src="/static/images/mercadopago-logo.webp"
                    width="80"
                    height="80"
                  />
                </v-sheet>

                <div class="ml-0 ml-sm-6 mt-4 mt-sm-0 text-center text-sm-left">
                  <h3 class="text-h5 font-weight-bold mb-2">Tu cuenta está activa</h3>
                  <div class="text-body-1 text-medium-emphasis d-flex align-center justify-center justify-sm-start">
                    <v-icon size="16" class="mr-1">mdi-shield-check</v-icon>
                    Conexión segura establecida
                  </div>

                  <div class="d-flex flex-wrap ga-2 mt-3 justify-center justify-sm-start">
                    <v-chip color="success" variant="tonal" size="small">
                      <v-icon start size="16">mdi-flash</v-icon>
                      Pagos inmediatos
                    </v-chip>
                    <v-chip color="primary" variant="tonal" size="small">
                      <v-icon start size="16">mdi-lock</v-icon>
                      100% seguro
                    </v-chip>
                  </div>
                </div>
              </div>

              <v-btn
                color="error"
                variant="outlined"
                class="mt-4 mt-sm-0"
                :disabled="unlinking"
                :loading="unlinking"
                @click="showConfirmModal = true"
              >
                <v-icon start>mdi-link-off</v-icon>
                Desvincular cuenta
              </v-btn>
            </div>
          </v-card-text>
        </v-card>

        <!-- VINCULAR CUENTA -->
        <v-card v-else class="elevation-4">
          <v-card-title class="d-flex align-center bg-grey-lighten-4">
            <v-icon color="warning" size="24" class="mr-2">mdi-link-variant</v-icon>
            <span class="text-h6">Conecta tu cuenta de Mercado Pago</span>
          </v-card-title>

          <v-card-text class="pa-8 pa-sm-12">
            <div class="d-flex flex-column align-center text-center">
              <v-sheet
                class="rounded-lg pa-2 mb-6 d-flex align-center justify-center"
                color="orange-lighten-5"
                width="120"
                height="120"
              >
                <v-img
                  src="/static/images/mercadopago-logo.webp"
                  width="100"
                  height="100"
                />
              </v-sheet>

              <h3 class="text-h5 font-weight-bold mb-3">¡Empieza a recibir pagos hoy!</h3>
              <p class="text-h6 text-medium-emphasis mb-6">
                Conecta tu cuenta en segundos y recibe el dinero de tus ventas de forma automática
              </p>

              <v-row class="mb-6">
                <v-col cols="12" md="6">
                  <v-sheet class="rounded-lg pa-3 bg-grey-lighten-4 d-flex align-center ga-3">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span class="text-body-1">Pagos inmediatos</span>
                  </v-sheet>
                </v-col>
                <v-col cols="12" md="6">
                  <v-sheet class="rounded-lg pa-3 bg-grey-lighten-4 d-flex align-center ga-3">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span class="text-body-1">100% seguro</span>
                  </v-sheet>
                </v-col>
              </v-row>

              <v-alert
                type="info"
                variant="tonal"
                class="mb-6"
                density="compact"
              >
                <div class="text-body-2">
                  Recuerda que debes iniciar sesión en Mercado Pago para vincular
                </div>
              </v-alert>

              <v-btn
                color="primary"
                size="large"
                class="px-8"
                :loading="linking"
                :disabled="linking"
                block
                style="max-width: 400px"
                @click="initiateLinking"
              >
                <v-icon start>mdi-link</v-icon>
                <span>Vincular ahora</span>
              </v-btn>

              <div class="text-body-2 text-medium-emphasis mt-4">
                ¿No puedes vincular tu cuenta de Mercado Pago?
                <a
                  href="#"
                  class="text-primary text-decoration-underline"
                  @click.prevent="showHelpModal = true"
                >
                  Haz click aquí
                </a>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- FAQ Section -->
      <v-col cols="12">
        <AdminPaymentMethodsMercadopagoFaqSection />
      </v-col>

      <!-- Modal de confirmación para desvincular -->
      <AdminPaymentMethodsMercadopagoUnlinkConfirmationModal
        v-model:show="showConfirmModal"
        :unlinking="unlinking"
        @confirm="handleUnlinkAccount"
      />

      <!-- Modal de ayuda para vinculación -->
      <AdminPaymentMethodsMercadopagoLinkingHelpModal
        v-model:show="showHelpModal"
      />
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAlertStore } from '~/stores/alert'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const router = useRouter()
const authStore = useAuthStore()
const alertStore = useAlertStore()
const runtimeConfig = useRuntimeConfig()

const isLinked = ref(false)
const loading = ref(true)
const linking = ref(false)
const unlinking = ref(false)
const showConfirmModal = ref(false)
const showHelpModal = ref(false)

const userId = computed(() => authStore.getUserId)
const mpLinkingUrl = computed(() => runtimeConfig.public.mpLinkAuthSplit)
const mpUnlinkingUrl = computed(() => runtimeConfig.public.mpUnlinkAuthSplit)

/**
 * Initiate MercadoPago account linking
 * Opens the MercadoPago OAuth authorization URL
 */
async function initiateLinking() {
  try {
    linking.value = true

    // Check if the linking URL is configured
    if (!mpLinkingUrl.value) {
      alertStore.showAlert('URL de vinculación no configurada. Verifica la variable NUXT_MP_SPLIT_LINK en .env', 'error')
      return
    }

    // Open MercadoPago authorization in new window
    window.open(mpLinkingUrl.value, '_blank')

    alertStore.showAlert('Serás redirigido a MercadoPago para autorizar la vinculación', 'info')
  } catch {
    alertStore.showAlert('Error al iniciar la vinculación', 'error')
  } finally {
    linking.value = false
  }
}

/**
 * Handle account unlinking
 * Opens the MercadoPago unlink authorization URL
 */
async function handleUnlinkAccount() {
  try {
    unlinking.value = true

    // Check if the unlinking URL is configured
    if (!mpUnlinkingUrl.value) {
      alertStore.showAlert('URL de desvinculación no configurada. Verifica la variable NUXT_MP_SPLIT_UNLINK en .env', 'error')
      unlinking.value = false
      return
    }

    // Show alert message
    alertStore.showAlert('Serás redirigido a MercadoPago para desvincular la cuenta', 'info')

    // Wait 2 seconds to give user time to read the toast
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Open MercadoPago unlink authorization in new window
    window.open(mpUnlinkingUrl.value, '_blank')

    showConfirmModal.value = false
  } catch {
    alertStore.showAlert('Error al iniciar la desvinculación', 'error')
  } finally {
    unlinking.value = false
  }
}

/**
 * Check if user has linked MercadoPago account
 */
async function checkLinkageStatus() {
  if (!userId.value) {
    loading.value = false
    return
  }

  try {
    // TODO: Implement when backend endpoint is ready
    // const { data, error } = await getLinkageStatus(userId.value)
    // if (error) {
    //   alertStore.showAlert('Error al verificar la vinculación', 'error')
    //   return
    // }
    // isLinked.value = data?.linked || false

    // Mock data for testing UI
    isLinked.value = false
  } catch {
    alertStore.showAlert('Error al verificar la vinculación', 'error')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await checkLinkageStatus()
})
</script>

