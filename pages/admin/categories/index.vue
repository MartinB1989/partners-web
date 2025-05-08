<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Categorías</h1>
          <div>
            <v-btn
              variant="outlined"
              class="mr-2"
              prepend-icon="mdi-arrow-left"
              @click="() => router.back()"
            >
              Atrás
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              :to="'/admin/categories/new'"
            >
              Crear nueva categoría
            </v-btn>
          </div>
        </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="categories"
            :loading="loading"
            class="elevation-1"
          >
            <template #[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                @click="editCategory(item)"
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

    <!-- Modal de confirmación para eliminar categoría -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar la categoría <strong>{{ categoryToDelete?.name }}</strong>?
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
import { useRouter } from 'vue-router'
import type { Category } from '~/types/categories'
import type { TableHeader } from '~/types/table-header'
import { useCategories } from '~/composables/services/useCategories'
import { useAlertStore } from '~/stores/alert'

definePageMeta({
  layout: 'admin',
})


const router = useRouter()

const headers: TableHeader[] = [
  { title: 'ID', key: 'id' },
  { title: 'Nombre', key: 'name' },
  { title: 'Nivel', key: 'level' },
  { title: 'Padre', key: 'parent.name' },
  { title: 'Id Name', key: 'idName' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const categories = ref<Category[]>([])
const loading = ref<boolean>(false)
const deleteDialog = ref<boolean>(false)
const categoryToDelete = ref<Category | null>(null)
const { getCategories } = useCategories()
const alertStore = useAlertStore()

const loadCategories = async (): Promise<void> => {
  loading.value = true
  try {
    const { data, error } = await getCategories()
    if (error) {
      alertStore.showAlert('Error al cargar categorías. Vuelve a cargar la página', 'error')
    } else {
      categories.value = data
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  } finally {
    loading.value = false
  }
}

// Función para editar una categoría
const editCategory = (category: Category): void => {
  // Navegar a la página de edición
  navigateTo(`/admin/categories/edit/${category.id}`)
}

// Función para mostrar el modal de eliminación
const showDeleteModal = (category: Category): void => {
  categoryToDelete.value = category
  deleteDialog.value = true
}


// Función para confirmar la eliminación de la categoría
const confirmDelete = async (): Promise<void> => {
  // Aquí irá la lógica para eliminar la categoría
  deleteDialog.value = false
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>

</style>