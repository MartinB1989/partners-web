<template>
  <v-container class="px=0">
    <v-row class="px-0">
      <v-col cols="12" class="px-0">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Detalle de Orden</h1>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="() => router.back()"
          >
            Atrás
          </v-btn>
        </div>

        <!-- Loading state -->
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="primary"
          class="mb-4"
        />

        <!-- Main content -->
        <div v-if="!loading && order" class="space-y-4">
          <!-- Información General -->
          <v-card>
            <v-card-title>Información General</v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Número de Orden</label>
                    <p class="text-body1">{{ order.orderNumber }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">ID de Orden</label>
                    <p class="text-body1">{{ order.id }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold d-block mb-2">Estado</label>
                    <v-chip
                      color="warning"
                      size="large"
                      class="mb-4"
                    >
                      {{ order.status ? getFriendlyStatus(order.status) : 'Sin estado' }}
                    </v-chip>

                    <!-- Botones de cambio de estado -->
                    <div class="d-flex flex-wrap">
                      <v-btn
                        v-if="order.status === OrderStatus.PENDING"
                        color="info"
                        size="small"
                        class="mr-2 mb-2"
                        @click="openConfirmationModal(OrderStatus.PROCESSING)"
                      >
                        Preparar pedido
                      </v-btn>

                      <v-btn
                        v-if="order.status === OrderStatus.PROCESSING"
                        color="primary"
                        size="small"
                        class="mr-2 mb-2"
                        @click="openConfirmationModal(OrderStatus.SHIPPED)"
                      >
                        Enviado
                      </v-btn>

                      <v-btn
                        v-if="order.status === OrderStatus.SHIPPED"
                        color="success"
                        size="small"
                        class="mr-2 mb-2"
                        @click="openConfirmationModal(OrderStatus.DELIVERED)"
                      >
                        Entregado
                      </v-btn>

                      <v-btn
                        color="error"
                        size="small"
                        class="mr-2 mb-2"
                        @click="openConfirmationModal(OrderStatus.CANCELLED)"
                      >
                        Cancelar orden
                      </v-btn>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Fecha de Creación</label>
                    <p class="text-body1">{{ formatDate(order.createdAt) }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Última Actualización</label>
                    <p class="text-body1">{{ formatDate(order.updatedAt) }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Tipo de Entrega</label>
                    <p class="text-body1">{{ getDeliveryTypeLabel(order.deliveryType) }}</p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Información del Cliente -->
          <v-card>
            <v-card-title>Información del Cliente</v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Nombre</label>
                    <p class="text-body1">{{ order.name }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Email</label>
                    <p class="text-body1">{{ order.email }}</p>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Teléfono</label>
                    <p class="text-body1">{{ order.phone || 'No especificado' }}</p>
                  </div>
                </v-col>
              </v-row>
              <div v-if="order.notes" class="mt-4">
                <label class="text-subtitle2 font-weight-bold">Notas</label>
                <p class="text-body1">{{ order.notes }}</p>
              </div>
            </v-card-text>
          </v-card>

          <!-- Dirección de Entrega -->
          <v-card v-if="order.address">
            <v-card-title>Dirección de Entrega</v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Calle</label>
                    <p class="text-body1">{{ order.address.street }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Número</label>
                    <p class="text-body1">{{ order.address.number }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Ciudad</label>
                    <p class="text-body1">{{ order.address.city }}</p>
                  </div>
                </v-col>
                <v-col cols="12" md="6">
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Provincia</label>
                    <p class="text-body1">{{ order.address.state }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">Código Postal</label>
                    <p class="text-body1">{{ order.address.zipCode }}</p>
                  </div>
                  <div class="mb-4">
                    <label class="text-subtitle2 font-weight-bold">País</label>
                    <p class="text-body1">{{ order.address.country }}</p>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Productos -->
          <v-card>
            <v-card-title>Productos</v-card-title>
            <v-divider />
            <v-card-text>
              <div v-if="order.items && order.items.length > 0">
                <!-- Vista Desktop -->
                <v-table v-if="$vuetify.display.mdAndUp" dense>
                  <thead>
                    <tr>
                      <th class="text-left">Imagen</th>
                      <th class="text-left">Producto</th>
                      <th class="text-right">Cantidad</th>
                      <th class="text-right">Precio Unitario</th>
                      <th class="text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id">
                      <td>
                        <v-img
                          v-if="item.imageUrl"
                          :src="item.imageUrl"
                          alt="Producto"
                          max-width="60"
                          class="rounded"
                        />
                        <span v-else class="text-caption text-grey">Sin imagen</span>
                      </td>
                      <td>{{ item.title }}</td>
                      <td class="text-right">{{ item.quantity }}</td>
                      <td class="text-right">{{ formatToCurrency(item.unitPrice) }}</td>
                      <td class="text-right">{{ formatToCurrency(item.subTotal) }}</td>
                    </tr>
                  </tbody>
                </v-table>

                <!-- Vista Mobile -->
                <div v-else>
                  <v-card
                    v-for="item in order.items"
                    :key="item.id"
                    variant="outlined"
                    class="mb-3"
                  >
                    <v-card-text>
                      <div class="d-flex flex-column align-center mb-3">
                        <v-img
                          v-if="item.imageUrl"
                          :src="item.imageUrl"
                          alt="Producto"
                          width="120"
                          height="120"
                          cover
                          class="rounded mb-2"
                        />
                        <span v-else class="text-caption text-grey mb-2">Sin imagen</span>
                        <span class="text-body-1 font-weight-bold text-center">{{ item.title }}</span>
                      </div>
                      <v-divider class="my-2" />
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Cantidad:</span>
                        <span class="text-body-2 font-weight-medium">{{ item.quantity }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Precio Unitario:</span>
                        <span class="text-body-2 font-weight-medium">{{ formatToCurrency(item.unitPrice) }}</span>
                      </div>
                      <v-divider class="my-2" />
                      <div class="d-flex justify-space-between">
                        <span class="text-body-2 font-weight-bold">Subtotal:</span>
                        <span class="text-body-2 font-weight-bold text-primary">{{ formatToCurrency(item.subTotal) }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
              <p v-else class="text-center text-grey">No hay productos en esta orden</p>
            </v-card-text>
          </v-card>

          <!-- Resumen de Costos -->
          <v-card>
            <v-card-title>Resumen de Costos</v-card-title>
            <v-divider />
            <v-card-text>
              <v-row>
                <v-col cols="12" md="8" offset-md="4">
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body1">Subtotal de Productos:</span>
                    <span class="text-body1 font-weight-bold">{{ formatToCurrency(order.itemsPriceSum ?? 0) }}</span>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between mb-3">
                    <span class="text-body1">Costo de Envío:</span>
                    <span class="text-body1 font-weight-bold">{{ formatToCurrency(order.deliveryPrice || 0) }}</span>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between mt-4">
                    <span class="text-h6 font-weight-bold">Total:</span>
                    <span class="text-h6 font-weight-bold text-primary">{{ formatToCurrency(order.total) }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>

        <!-- Error state -->
        <v-alert
          v-if="!loading && error"
          type="error"
          title="Error al cargar la orden"
          :text="error"
          closable
        />

        <!-- Not found state -->
        <v-alert
          v-if="!loading && !order && !error"
          type="warning"
          title="Orden no encontrada"
          text="No se pudo encontrar la orden solicitada."
        />
      </v-col>
    </v-row>

    <!-- Modal de confirmación -->
    <v-dialog
      v-model="showConfirmationModal"
      max-width="500"
      persistent
    >
      <v-card>
        <v-card-title class="text-h5">
          ¿Está seguro?
        </v-card-title>
        <v-card-text>
          Esta acción es irreversible, cambiará el estado de la orden a "{{ pendingStatus ? getFriendlyStatus(pendingStatus) : 'Sin estado' }}".
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey"
            variant="text"
            :disabled="updatingStatus"
            @click="closeConfirmationModal"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="updatingStatus"
            @click="confirmStatusChange"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { OrderStatus } from '~/types/order'
import type { Order } from '~/types/order'
import useOrder from '~/composables/services/useOrder'
import { useAlertStore } from '~/stores/alert'
import { useCurrency } from '~/composables/useCurrency'
import { useRouter, useRoute } from 'vue-router'
import { getFriendlyStatus } from '~/utils'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const route = useRoute()
const { getOrderById, updateOrderStatus } = useOrder()
const alertStore = useAlertStore()
const { formatToCurrency } = useCurrency()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Estados para el modal de confirmación
const showConfirmationModal = ref(false)
const pendingStatus = ref<OrderStatus | null>(null)
const updatingStatus = ref(false)

const formatDate = (dateString?: Date | string): string => {
  if (!dateString) return 'No especificado'
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDeliveryTypeLabel = (deliveryType: string): string => {
  const deliveryLabels: Record<string, string> = {
    SHIPPING: 'Envío a Domicilio',
    PICKUP: 'Retiro en persona',
  }
  return deliveryLabels[deliveryType] || deliveryType
}

const loadOrder = async (): Promise<void> => {
  loading.value = true
  error.value = null

  try {
    const orderId = route.params.id || route.query.id
    if (!orderId) {
      error.value = 'No se especificó el ID de la orden'
      alertStore.showAlert('Error: No se especificó el ID de la orden', 'error')
      return
    }

    const { data, error: apiError } = await getOrderById(Number(orderId))

    if (apiError) {
      error.value = 'No se pudo cargar la orden. Intenta nuevamente.'
      console.error('Error al cargar orden:', apiError)
      alertStore.showAlert('Error al cargar la orden', 'error')
    } else if (data) {
      order.value = data
    }
  } catch (err) {
    error.value = 'Error inesperado al cargar la orden'
    console.error('Error:', err)
    alertStore.showAlert('Error inesperado al cargar la orden', 'error')
  } finally {
    loading.value = false
  }
}

const openConfirmationModal = (newStatus: OrderStatus): void => {
  pendingStatus.value = newStatus
  showConfirmationModal.value = true
}

const closeConfirmationModal = (): void => {
  if (!updatingStatus.value) {
    showConfirmationModal.value = false
    pendingStatus.value = null
  }
}

const confirmStatusChange = async (): Promise<void> => {
  if (!order.value || !pendingStatus.value) return

  updatingStatus.value = true

  try {
    const { data, error: apiError } = await updateOrderStatus(
      Number(order.value.id),
      pendingStatus.value
    )

    if (apiError) {
      alertStore.showAlert(apiError, 'error')
      return
    }

    if (data && data.status) {
      // Actualizar el estado de la orden en la UI
      order.value.status = data.status
      alertStore.showAlert('Estado de la orden actualizado correctamente', 'success')
      showConfirmationModal.value = false
      pendingStatus.value = null
    }
  } catch (err) {
    alertStore.showAlert('Error inesperado al actualizar el estado', 'error')
    console.error('Error:', err)
  } finally {
    updatingStatus.value = false
  }
}

onMounted(() => {
  loadOrder()
})
</script>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}

.space-y-4 {
  display: flex;
  flex-direction: column;
}
</style>
