<template>
  <v-container class="px-0">
    <v-row class="px-0">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Órdenes</h1>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="() => router.back()"
          >
            Atrás
          </v-btn>
        </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="orders"
            :loading="loading"
            mobile-breakpoint="md"
            class="elevation-1"
          >
            <template #[`item.status`]="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
              >
                {{ getFriendlyStatus(item.status as OrderStatus) }}
              </v-chip>
            </template>

            <template #[`item.finalTotal`]="{ item }">
              {{ formatToCurrency(item.finalTotal) }}
            </template>

            <template #[`item.createdAt`]="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template #[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-eye"
                variant="text"
                color="primary"
                @click="viewOrder(item)"
              />
            </template>

            <!-- Vista móvil personalizada -->
            <template #item="{ item }">
              <tr v-if="$vuetify.display.mdAndUp">
                <td>{{ item.orderNumber }}</td>
                <td>{{ item.id }}</td>
                <td>{{ formatToCurrency(item.finalTotal) }}</td>
                <td>{{ item.deliveryType }}</td>
                <td>
                  <v-chip
                    :color="getStatusColor(item.status)"
                    size="small"
                  >
                    {{ getFriendlyStatus(item.status as OrderStatus) }}
                  </v-chip>
                </td>
                <td>{{ formatDate(item.createdAt) }}</td>
                <td>{{ item.itemsCount }}</td>
                <td>
                  <v-btn
                    icon="mdi-eye"
                    variant="text"
                    color="primary"
                    @click="viewOrder(item)"
                  />
                </td>
              </tr>
              <tr v-else>
                <td colspan="100%">
                  <v-card variant="outlined" class="my-2">
                    <v-card-text>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Número de Orden:</span>
                        <span class="text-body-2 font-weight-medium">{{ item.orderNumber }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">ID:</span>
                        <span class="text-body-2 font-weight-medium">{{ item.id }}</span>
                      </div>
                      <div class="d-flex justify-space-between align-center mb-1">
                        <span class="text-body-2 text-grey-darken-1">Estado:</span>
                        <v-chip
                          :color="getStatusColor(item.status)"
                          size="small"
                        >
                          {{ getFriendlyStatus(item.status as OrderStatus) }}
                        </v-chip>
                      </div>
                      <v-divider class="my-2" />
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Total:</span>
                        <span class="text-body-2 font-weight-bold text-primary">
                          {{ formatToCurrency(item.finalTotal) }}
                        </span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Tipo de entrega:</span>
                        <span class="text-body-2">{{ item.deliveryType }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Fecha:</span>
                        <span class="text-body-2">{{ formatDate(item.createdAt) }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Items:</span>
                        <span class="text-body-2">{{ item.itemsCount }}</span>
                      </div>
                      <v-divider class="my-2" />
                      <div class="d-flex justify-end">
                        <v-btn
                          variant="outlined"
                          size="small"
                          prepend-icon="mdi-eye"
                          @click="viewOrder(item)"
                        >
                          Ver Detalle
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useOrder from '~/composables/services/useOrder'
import type { OrderStatus, OrderSummary } from '~/types/order'
import { useAlertStore } from '~/stores/alert'
import { useRouter } from 'vue-router'
import { useCurrency } from '~/composables/useCurrency'
import type { TableHeader } from '~/types/table-header'

definePageMeta({
  layout: 'admin',
})

const { getOrders } = useOrder()
const alertStore = useAlertStore()
const router = useRouter()
const { formatToCurrency } = useCurrency()

const headers: TableHeader[] = [
  { title: 'Número de Orden', key: 'orderNumber' },
  { title: 'ID', key: 'id' },
  { title: 'Total', key: 'finalTotal' },
  { title: 'Tipo de entrega', key: 'deliveryType' },
  { title: 'Estado', key: 'status' },
  { title: 'Fecha', key: 'createdAt' },
  { title: 'Items', key: 'itemsCount' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const orders = ref<OrderSummary[]>([])
const loading = ref<boolean>(false)

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    pending: 'warning',
    completed: 'success',
    cancelled: 'error',
  }
  return statusColors[status] || 'info'
}

const loadOrders = async (): Promise<void> => {
  loading.value = true
  try {
    const { data, error } = await getOrders()
    if (error) {
      console.error('Error al cargar órdenes:', error)
      alertStore.showAlert('Error al cargar órdenes. Vuelve a cargar la página', 'error')
    } else if (data) {
      orders.value = data.data
    }
  } catch (error) {
    console.error('Error al cargar órdenes:', error)
    alertStore.showAlert('Error al cargar órdenes. Vuelve a cargar la página', 'error')
  } finally {
    loading.value = false
  }
}

const viewOrder = (order: OrderSummary): void => {
  router.push(`/admin/orders/detail?id=${order.id}`)
}

onMounted(() => {
  loadOrders()
})
</script>