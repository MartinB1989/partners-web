<template>
  <v-container>
    <v-row>
      <v-col cols="12">
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
                    <label class="text-subtitle2 font-weight-bold">Estado</label>
                    <v-chip
                      :color="getStatusColor(order.status || '')"
                      size="small"
                    >
                      {{ getStatusLabel(order.status || '') }}
                    </v-chip>
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
              <v-row v-if="order.items && order.items.length > 0">
                <v-col cols="12">
                  <v-table dense>
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
                </v-col>
              </v-row>
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
  </v-container>
</template>

<script setup lang="ts">
import type { Order, OrderStatus } from '~/types/order'
import useOrder from '~/composables/services/useOrder'
import { useAlertStore } from '~/stores/alert'
import { useCurrency } from '~/composables/useCurrency'
import { useRouter, useRoute } from 'vue-router'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const route = useRoute()
const { getOrderById } = useOrder()
const alertStore = useAlertStore()
const { formatToCurrency } = useCurrency()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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

const getStatusColor = (status: OrderStatus | string): string => {
  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: 'warning',
    PENDING: 'info',
    PROCESSING: 'info',
    SHIPPED: 'primary',
    DELIVERED: 'success',
    CANCELLED: 'error',
  }
  return statusColors[status] || 'grey'
}

const getStatusLabel = (status: OrderStatus | string): string => {
  const statusLabels: Record<string, string> = {
    PENDING_PAYMENT: 'Pendiente de Pago',
    PENDING: 'Pendiente',
    PROCESSING: 'En Proceso',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregado',
    CANCELLED: 'Cancelado',
  }
  return statusLabels[status] || status
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
