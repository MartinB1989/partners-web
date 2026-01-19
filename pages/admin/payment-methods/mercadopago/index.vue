<template>
  <div class="payment-linkage-page">
    <v-container class="px-4 px-sm-8 py-6">
      <v-row>
        <!-- Header Section -->
        <v-col cols="12" class="header-section">
          <div class="d-flex align-center mb-4">
            <v-btn icon variant="text" class="back-btn mr-3" @click="goBack">
              <v-icon size="28">mdi-chevron-left</v-icon>
            </v-btn>
            <div>
              <h1 class="page-title">Vinculación de pagos</h1>
              <div class="title-underline" />
            </div>
          </div>
          <div class="description-card">
            <v-icon color="primary" size="24" class="mr-3">mdi-information-outline</v-icon>
            <p class="description-text mb-0">
              Vincula tu cuenta de Mercado Pago para gestionar los ingresos de
              tus ventas de forma segura y automática.
              <br class="d-none d-sm-block">
              <span class="text-primary font-weight-medium">¿Ya tienes una cuenta vinculada?</span>
              Puedes desvincularla y conectar una nueva cuando lo necesites.
            </p>
          </div>
        </v-col>

        <!-- Loading State -->
        <v-col v-if="loading" cols="12" class="d-flex justify-center align-center" style="min-height: 400px">
          <v-progress-circular indeterminate color="primary" size="64" />
        </v-col>

        <!-- Account Status Section -->
        <v-col v-else cols="12">
          <!-- CUENTA VINCULADA -->
          <div v-if="isLinked" class="status-card linked-card">
            <div class="status-header">
              <v-icon color="success" size="24" class="mr-2">mdi-check-circle</v-icon>
              <span class="status-title">Cuenta vinculada exitosamente</span>
            </div>
            <div class="linked-content">
              <div class="d-flex flex-column flex-sm-row align-center justify-space-between">
                <div class="d-flex flex-column flex-sm-row align-center">
                  <div class="mp-logo-container">
                    <v-img
                      src="/static/images/mercadopago-logo.webp"
                      width="80"
                      height="80"
                      class="mp-logo"
                    />
                  </div>
                  <div class="account-info ml-0 ml-sm-6 mt-4 mt-sm-0 text-center text-sm-left">
                    <h3 class="account-title">Tu cuenta está activa</h3>
                    <p class="account-subtitle">
                      <v-icon size="16" class="mr-1">mdi-shield-check</v-icon>
                      Conexión segura establecida
                    </p>
                    <div class="benefits-chips mt-2">
                      <v-chip color="success" variant="tonal" size="small" class="mr-2 mb-1">
                        <v-icon start size="16">mdi-flash</v-icon>
                        Pagos inmediatos
                      </v-chip>
                      <v-chip color="primary" variant="tonal" size="small" class="mb-1">
                        <v-icon start size="16">mdi-lock</v-icon>
                        100% seguro
                      </v-chip>
                    </div>
                  </div>
                </div>
                <v-btn
                  color="error"
                  variant="outlined"
                  class="unlink-btn mt-4 mt-sm-0"
                  :disabled="unlinking"
                  :loading="unlinking"
                  @click="showConfirmModal = true"
                >
                  <v-icon start>mdi-link-off</v-icon>
                  Desvincular cuenta
                </v-btn>
              </div>
            </div>
          </div>

          <!-- VINCULAR CUENTA -->
          <div v-else class="status-card unlinked-card">
            <div class="status-header">
              <v-icon color="warning" size="24" class="mr-2">mdi-link-variant</v-icon>
              <span class="status-title">Conecta tu cuenta de Mercado Pago</span>
            </div>
            <div class="unlinked-content">
              <div class="d-flex flex-column align-center text-center">
                <div class="mp-logo-container mb-4">
                  <v-img
                    src="/static/images/mercadopago-logo.webp"
                    width="100"
                    height="100"
                    class="mp-logo"
                  />
                </div>
                <h3 class="link-title mb-2">¡Empieza a recibir pagos hoy!</h3>
                <p class="link-subtitle mb-4">
                  Conecta tu cuenta en segundos y recibe el dinero de tus ventas de forma automática
                </p>
                <div class="benefits-grid mb-6">
                  <div class="benefit-item">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span>Pagos inmediatos</span>
                  </div>
                  <div class="benefit-item">
                    <v-icon color="success" size="20">mdi-check-circle</v-icon>
                    <span>Proceso 100% seguro</span>
                  </div>
                </div>
                <v-alert
                  type="info"
                  variant="tonal"
                  class="mb-4"
                  density="compact"
                >
                  <div class="text-body-2">
                    Recuerda que debes iniciar sesión en Mercado Pago para vincular
                  </div>
                </v-alert>
                <v-btn
                  color="primary"
                  size="large"
                  class="link-btn px-8"
                  :loading="linking"
                  :disabled="linking"
                  block
                  @click="initiateLinking"
                >
                  <v-icon start>mdi-link</v-icon>
                  <span class="text-wrap">Vincular cuenta ahora</span>
                </v-btn>
              </div>
            </div>
          </div>
        </v-col>

        <!-- FAQ Section -->
        <v-col cols="12">
          <div class="faq-section">
            <div class="section-header">
              <v-icon color="primary" size="28" class="mr-3">mdi-frequently-asked-questions</v-icon>
              <h2 class="section-title">Preguntas frecuentes</h2>
            </div>

            <v-expansion-panels variant="accordion" class="faq-panels">
              <!-- Comisiones de MercadoPago -->
              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="20" class="mr-3">mdi-calculator-variant</v-icon>
                    <span>¿Cuáles son las comisiones de Mercado Pago?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="commission-info">
                    <p class="mb-4">
                      Mercado Pago cobra una comisión por procesar los pagos,
                      que varía según el método de pago elegido por tus compradores:
                    </p>

                    <div class="commission-table">
                      <div class="table-header">
                        <div class="header-cell">Método de pago</div>
                        <div class="header-cell">Comisión + IVA</div>
                        <div class="header-cell">Disponibilidad</div>
                      </div>

                      <div class="table-row">
                        <div class="cell payment-method">
                          <v-icon color="success" size="16" class="mr-2">mdi-credit-card</v-icon>
                          Todos los medios
                        </div>
                        <div class="cell commission">6,29% + IVA</div>
                        <div class="cell availability">
                          <v-chip color="success" size="small" variant="tonal">
                            <v-icon start size="12">mdi-clock-fast</v-icon>
                            Al momento
                          </v-chip>
                        </div>
                      </div>

                      <div class="table-row">
                        <div class="cell payment-method">
                          <v-icon color="info" size="16" class="mr-2">mdi-credit-card</v-icon>
                          Todos los medios
                        </div>
                        <div class="cell commission">4,39% + IVA</div>
                        <div class="cell availability">
                          <v-chip color="info" size="small" variant="tonal">
                            <v-icon start size="12">mdi-calendar-clock</v-icon>
                            10 días
                          </v-chip>
                        </div>
                      </div>

                      <div class="table-row">
                        <div class="cell payment-method">
                          <v-icon color="warning" size="16" class="mr-2">mdi-credit-card</v-icon>
                          Todos los medios
                        </div>
                        <div class="cell commission">3,39% + IVA</div>
                        <div class="cell availability">
                          <v-chip color="warning" size="small" variant="tonal">
                            <v-icon start size="12">mdi-calendar</v-icon>
                            18 días
                          </v-chip>
                        </div>
                      </div>

                      <div class="table-row">
                        <div class="cell payment-method">
                          <v-icon color="primary" size="16" class="mr-2">mdi-credit-card</v-icon>
                          Todos los medios
                        </div>
                        <div class="cell commission">1,49% + IVA</div>
                        <div class="cell availability">
                          <v-chip color="primary" size="small" variant="tonal">
                            <v-icon start size="12">mdi-calendar-month</v-icon>
                            35 días
                          </v-chip>
                        </div>
                      </div>
                    </div>

                    <div class="commission-note">
                      <p class="mb-3">
                        <strong>Importante:</strong> Estas comisiones son
                        cobradas directamente por Mercado Pago y pueden cambiar
                        según sus políticas.
                      </p>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="20" class="mr-3">mdi-help-circle-outline</v-icon>
                    <span>¿Por qué necesitamos vincular tu cuenta de Mercado Pago?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="faq-text">
                    Para que puedas recibir los pagos de forma inmediata de las
                    ventas realizadas a través de nuestra plataforma, es necesario vincular
                    tu cuenta de Mercado Pago. Esta vinculación es un proceso
                    <strong>100% seguro</strong> y autorizado directamente por
                    Mercado Pago. <br><br>
                    Al vincular tu cuenta, garantizas que los compradores puedan
                    pagar con total confianza y tú recibas el dinero de manera
                    automática.
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="20" class="mr-3">mdi-shield-check</v-icon>
                    <span>¿Qué permisos solicita la plataforma?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="faq-text">
                    Al vincular tu cuenta, Mercado Pago te informará que nuestra plataforma podrá:
                    <div class="permissions-list mt-3">
                      <div class="permission-item">
                        <v-icon color="success" size="18" class="mr-2">mdi-eye-outline</v-icon>
                        <div>
                          <strong>Ver algunos datos de tu cuenta:</strong> solo
                          accedemos a la información necesaria para procesar los
                          pagos de tus ventas (nombre, email y movimientos
                          relacionados con las transacciones).
                          <div class="highlight-text">
                            <v-icon size="16" class="mr-1">mdi-shield-lock</v-icon>
                            No tenemos acceso a datos NO relacionados con la plataforma
                          </div>
                        </div>
                      </div>
                      <div class="permission-item">
                        <v-icon color="success" size="18" class="mr-2">mdi-cash-multiple</v-icon>
                        <div>
                          <strong>Crear y administrar pagos en tu nombre:</strong>
                          necesario para que recibas el dinero de las ventas
                          y, si corresponde, realizar devoluciones a
                          tus compradores.
                          <div class="highlight-text">
                            <v-icon size="16" class="mr-1">mdi-shield-lock</v-icon>
                            No podemos realizar compras en tu nombre
                          </div>
                        </div>
                      </div>
                      <div class="permission-item">
                        <v-icon color="success" size="18" class="mr-2">mdi-cog-outline</v-icon>
                        <div>
                          <strong>Operar con tu cuenta:</strong> solo para
                          gestionar los cobros de tus ventas en la plataforma.
                          <div class="highlight-text">
                            <v-icon size="16" class="mr-1">mdi-shield-lock</v-icon>
                            No podemos transferir dinero fuera de las
                            operaciones de venta
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="error" size="20" class="mr-3">mdi-shield-off-outline</v-icon>
                    <span>¿Qué NO puede hacer la plataforma con tu cuenta?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="restrictions-list">
                    <div class="restriction-item">
                      <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
                      <span>No podemos acceder a tu dinero ni transferir fondos a cuentas externas</span>
                    </div>
                    <div class="restriction-item">
                      <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
                      <span>No podemos ver información privada de otras operaciones
                        no relacionadas con tus ventas</span>
                    </div>
                    <div class="restriction-item">
                      <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
                      <span>No podemos realizar compras, pagos personales ni
                        modificar tus datos en Mercado Pago</span>
                    </div>
                    <div class="restriction-item">
                      <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
                      <span>No compartimos tu información con terceros</span>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="20" class="mr-3">mdi-alert-circle-outline</v-icon>
                    <span>¿Por qué Mercado Pago muestra estos avisos?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="faq-text">
                    Mercado Pago informa sobre todos los permisos posibles que
                    una aplicación puede solicitar, pero
                    <strong>nuestra plataforma solo utiliza los estrictamente necesarios</strong>
                    para gestionar la venta de productos y la acreditación de tus
                    cobros. <br><br>
                    Es una medida de transparencia y seguridad que aplica
                    Mercado Pago con todas las aplicaciones integradas.
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="20" class="mr-3">mdi-link-off</v-icon>
                    <span>¿Puedo revocar la vinculación?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="faq-text">
                    <strong>¡Por supuesto!</strong> Puedes desvincular tu cuenta
                    en cualquier momento:
                    <div class="revoke-options mt-3">
                      <div class="revoke-option">
                        <v-icon color="primary" size="18" class="mr-2">mdi-application-cog</v-icon>
                        <span>Desde esta página usando el botón "Desvincular"</span>
                      </div>
                      <div class="revoke-option">
                        <v-icon color="primary" size="18" class="mr-2">mdi-shield-account</v-icon>
                        <span>Desde tu cuenta de Mercado Pago, en "Herramientas de Seguridad"</span>
                      </div>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>

              <v-expansion-panel class="faq-panel">
                <v-expansion-panel-title class="faq-title">
                  <div class="d-flex align-center">
                    <v-icon color="primary" size="20" class="mr-3">mdi-chat-question</v-icon>
                    <span>¿Tienes más dudas?</span>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text class="faq-content">
                  <div class="contact-section">
                    <p class="mb-4">
                      Nuestro equipo está aquí para ayudarte. Contáctanos por tu medio preferido:
                    </p>
                    <div class="contact-options">
                      <v-btn
                        color="primary"
                        variant="outlined"
                        href="mailto:soporte@partners.com"
                        class="contact-btn mb-3"
                        block
                      >
                        <v-icon start>mdi-email</v-icon>
                        <span class="contact-text">soporte@partners.com</span>
                      </v-btn>
                      <v-btn
                        color="success"
                        variant="outlined"
                        href="https://wa.me/5491112345678"
                        target="_blank"
                        class="contact-btn mb-3"
                        block
                      >
                        <v-icon start>mdi-whatsapp</v-icon>
                        <span class="contact-text">+54 9 11 1234-5678</span>
                      </v-btn>
                    </div>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>
        </v-col>

        <!-- Modal de confirmación para desvincular -->
        <v-dialog v-model="showConfirmModal" max-width="500" persistent>
          <v-card class="confirmation-modal">
            <v-card-title class="modal-header d-flex align-center pa-6">
              <v-icon color="warning" size="28" class="mr-3">mdi-alert-circle</v-icon>
              <span class="modal-title">¿Desvincular cuenta?</span>
            </v-card-title>

            <v-card-text class="modal-content pa-6">
              <div class="warning-content">
                <v-alert type="warning" variant="tonal" class="mb-4">
                  <div>
                    <p class="mb-2"><strong>⚠️ Importante:</strong></p>
                    <p class="mb-0">
                      Una vez desvinculada tu cuenta, el dinero de tus ventas ingresara a la cuenta de la plataforma.
                    </p>
                  </div>
                </v-alert>

                <div class="consequences-list">
                  <h4 class="mb-3">Esto significa que:</h4>
                  <div class="consequence-item">
                    <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
                    <span>No recibiras el dinero de forma inmediata</span>
                  </div>
                  <div class="consequence-item">
                    <v-icon color="warning" size="18" class="mr-2">mdi-alert-circle</v-icon>
                    <span>Deberás vincular una nueva cuenta para reactivar los cobros inmediatos</span>
                  </div>
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="modal-actions pa-6 pt-0">
              <v-spacer />
              <v-btn
                variant="outlined"
                color="grey"
                class="mr-3"
                :disabled="unlinking"
                @click="showConfirmModal = false"
              >
                <v-icon start>mdi-close</v-icon>
                Cancelar
              </v-btn>
              <v-btn
                color="warning"
                :loading="unlinking"
                :disabled="unlinking"
                @click="handleUnlinkAccount"
              >
                <v-icon start>mdi-link-off</v-icon>
                Desvincular cuenta
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
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

const userId = computed(() => authStore.getUserId)
const mpLinkingUrl = computed(() => runtimeConfig.public.mpLinkAuthSplit)
const mpUnlinkingUrl = computed(() => runtimeConfig.public.mpUnlinkAuthSplit)

function goBack() {
  router.back()
}

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

<style scoped>
/* Page Layout */
.payment-linkage-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Header Styles */
.header-section {
  margin-bottom: 1rem;
}

.back-btn {
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(-4px);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
  border-radius: 2px;
}

.description-card {
  display: flex;
  align-items: flex-start;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-top: 1.5rem;
}

.description-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #5f6368;
}

/* Status Cards */
.status-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.status-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.status-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.status-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* Linked Account Styles */
.linked-content {
  padding: 2rem;
}

.mp-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #fff9e6 0%, #ffe6cc 100%);
  border-radius: 16px;
  padding: 0.5rem;
}

.mp-logo {
  object-fit: contain;
}

.account-info {
  flex: 1;
}

.account-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.account-subtitle {
  display: flex;
  align-items: center;
  font-size: 1rem;
  color: #5f6368;
  margin: 0;
}

.benefits-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.unlink-btn {
  min-width: 200px;
}

/* Unlinked Account Styles */
.unlinked-content {
  padding: 3rem 2rem;
}

.link-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.link-subtitle {
  font-size: 1.1rem;
  color: #5f6368;
  max-width: 500px;
  margin: 0 auto;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a1a1a;
}

.link-btn {
  max-width: 400px;
  margin: 0 auto;
}

/* FAQ Section */
.faq-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
}

.faq-panels {
  border-radius: 12px;
  overflow: hidden;
}

.faq-panel {
  background: white;
  margin-bottom: 0.75rem;
  border-radius: 12px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.faq-title {
  font-size: 1.05rem;
  font-weight: 600;
  padding: 1.25rem 1.5rem;
}

.faq-content {
  padding: 1.5rem;
  background: #fafbfc;
}

.faq-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #5f6368;
}

/* Commission Table */
.commission-info {
  font-size: 1rem;
  color: #5f6368;
}

.commission-table {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
  margin-bottom: 1.5rem;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white;
  font-weight: 600;
  padding: 1rem;
}

.header-cell {
  padding: 0.5rem;
  font-size: 0.95rem;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  transition: background 0.2s ease;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: #f5f7fa;
}

.cell {
  padding: 0.5rem;
  display: flex;
  align-items: center;
}

.payment-method {
  font-weight: 500;
  color: #1a1a1a;
}

.commission {
  font-weight: 600;
  color: #1976d2;
}

.commission-note {
  background: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-top: 1.5rem;
}

.commission-note p {
  margin: 0;
  color: #5f6368;
  line-height: 1.6;
}

/* Permissions & Restrictions */
.permissions-list,
.restrictions-list {
  margin-top: 1rem;
}

.permission-item,
.restriction-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.permission-item strong,
.restriction-item span {
  color: #1a1a1a;
  line-height: 1.6;
}

.highlight-text {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: #e8f5e9;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #2e7d32;
  font-weight: 500;
}

/* Revoke Options */
.revoke-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.revoke-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* Contact Section */
.contact-section {
  padding: 1rem 0;
}

.contact-options {
  max-width: 400px;
  margin: 0 auto;
}

.contact-btn {
  justify-content: flex-start;
  text-transform: none;
  font-size: 1rem;
}

.contact-text {
  font-weight: 500;
}

/* Confirmation Modal */
.confirmation-modal {
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.modal-content {
  background: white;
}

.warning-content {
  color: #5f6368;
}

.consequences-list {
  margin-top: 1rem;
}

.consequences-list h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.consequence-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #fafbfc;
  border-radius: 8px;
}

.consequence-item span {
  color: #5f6368;
  font-size: 0.95rem;
}

.modal-actions {
  background: #fafbfc;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-title {
    font-size: 1.5rem;
  }

  .description-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .header-cell,
  .cell {
    padding: 0.25rem;
  }

  .availability {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .page-title {
    font-size: 1.25rem;
  }

  .link-title {
    font-size: 1.4rem;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }

  .unlink-btn {
    min-width: 100%;
  }
}
</style>
