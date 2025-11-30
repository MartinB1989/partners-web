<template>
  <v-container>
    <v-row>
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
            class="elevation-1"
          >
            <template #[`item.status`]="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
              >
                {{ item.status }}
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
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import useOrder from '~/composables/services/useOrder'
import type { OrderSummary } from '~/types/order'
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

const viewOrder = (_order: OrderSummary): void => {
  // TODO: Navegar a la página de detalle de la orden cuando esté disponible
  alertStore.showAlert('El detalle de la orden aún no está disponible', 'info')
}

onMounted(() => {
  loadOrders()
})
</script>