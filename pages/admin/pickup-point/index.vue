<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-4 ga-3">
          <h1 class="text-h4">Puntos de Retiro</h1>
          <div class="d-flex flex-column flex-sm-row ga-2 buttons-container">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              class="action-btn"
              to="/admin/panel"
            >
              Atrás
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              class="action-btn"
              to="/admin/pickup-point/new"
            >
              Crear
            </v-btn>
          </div>
        </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="pickupPoints"
            :loading="loading"
            class="elevation-1"
          >
            <template #[`item.isActive`]="{ item }">
              <v-chip
                :color="item.isActive ? 'success' : 'error'"
                size="small"
              >
                {{ item.isActive ? 'Activo' : 'Inactivo' }}
              </v-chip>
            </template>

            <template #[`item.address`]="{ item }">
              {{ `${item.street} ${item.number}, ${item.city}, ${item.state}` }}
            </template>

            <template #[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                @click="editPickupPoint(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="showDeleteModal(item)"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Modal de confirmación para eliminar punto de retiro -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el punto de retiro <strong>{{ pickupPointToDelete?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" variant="text" @click="confirmDelete">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { usePickupPoint } from '~/composables/services/usePickupPoint'
import type { PickupAddress } from '~/types/pickup-address'
import { useAlertStore } from '~/stores/alert'
import { useRouter } from 'vue-router'
import type { TableHeader } from '~/types/table-header'

definePageMeta({
  layout: 'admin',
})

const { getPickupPoints, deletePickupPoint } = usePickupPoint()
const alertStore = useAlertStore()
const router = useRouter()

const headers: TableHeader[] = [
  { title: 'Nombre', key: 'name' },
  { title: 'Dirección', key: 'address' },
  { title: 'Ciudad', key: 'city' },
  { title: 'Código Postal', key: 'zipCode' },
  { title: 'Estado', key: 'isActive' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const pickupPoints = ref<PickupAddress[]>([])
const loading = ref<boolean>(false)
const deleteDialog = ref<boolean>(false)
const pickupPointToDelete = ref<PickupAddress | null>(null)

// Función para cargar los puntos de retiro
const loadPickupPoints = async (): Promise<void> => {
  loading.value = true
  try {
    const { data, error } = await getPickupPoints()
    if (error) {
      alertStore.showAlert('Error al cargar puntos de retiro. Vuelve a cargar la página', 'error')
    } else if (data) {
      pickupPoints.value = data
    }
  } catch {
    alertStore.showAlert('Error al cargar puntos de retiro. Vuelve a cargar la página', 'error')
  } finally {
    loading.value = false
  }
}

// Función para editar un punto de retiro
const editPickupPoint = (pickupPoint: PickupAddress): void => {
  // Navegar a la página de edición
  navigateTo(`/admin/pickup-point/edit/${pickupPoint.id}`)
}

// Función para mostrar el modal de eliminación
const showDeleteModal = (pickupPoint: PickupAddress): void => {
  pickupPointToDelete.value = pickupPoint
  deleteDialog.value = true
}

// Función para confirmar la eliminación del punto de retiro
const confirmDelete = async (): Promise<void> => {
  if (pickupPointToDelete.value && pickupPointToDelete.value.id) {
    try {
      const { error } = await deletePickupPoint(pickupPointToDelete.value.id)
      
      if (error) {
        console.error('Error al eliminar punto de retiro:', error)
        alertStore.showAlert('Error al eliminar punto de retiro', 'error')
      } else {
        alertStore.showAlert('Punto de retiro eliminado correctamente', 'success')
      }
      
      // Recargar los puntos de retiro
      await loadPickupPoints()
    } catch (error) {
      console.error('Error al eliminar punto de retiro:', error)
    } finally {
      deleteDialog.value = false
    }
  }
}

// Cargar puntos de retiro al montar el componente
onMounted(() => {
  loadPickupPoints()
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
</style>
