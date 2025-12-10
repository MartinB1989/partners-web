<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-4 ga-3">
          <h1 class="text-h4">Categorías</h1>
          <div class="d-flex flex-column flex-sm-row ga-2 buttons-container">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-arrow-left"
              class="action-btn"
              @click="() => router.back()"
            >
              Atrás
            </v-btn>
            <v-btn
              color="primary"
              class="action-btn"
              :to="'/admin/categories/new'"
            >
              Crear categoría
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
          <v-btn color="primary" variant="text" :disabled="isDeleting" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn 
            color="error" 
            variant="text" 
            :loading="isDeleting"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal de edición de categoría -->
    <CategoryEditModal
      v-model="editDialog"
      :category-id="categoryToEdit?.id || 0"
      :category-name="categoryToEdit?.name || ''"
      @category-updated="loadCategories"
      @close="editDialog = false"
    />
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCategories } from '~/composables/services/useCategories'
import { useAlertStore } from '~/stores/alert'
import CategoryEditModal from '~/components/admin/categories/CategoryEditModal.vue'
import type { Category } from '~/types/categories'
import type { TableHeader } from '~/types/table-header'

definePageMeta({
  layout: 'admin'
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
const editDialog = ref<boolean>(false)
const categoryToEdit = ref<Category | null>(null)
const isDeleting = ref<boolean>(false)
const { getCategories, deleteCategory } = useCategories()
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
  categoryToEdit.value = category
  editDialog.value = true
}

// Función para mostrar el modal de eliminación
const showDeleteModal = (category: Category): void => {
  categoryToDelete.value = category
  deleteDialog.value = true
}


// Función para confirmar la eliminación de la categoría
const confirmDelete = async (): Promise<void> => {
  try {
    if (categoryToDelete.value) {
      isDeleting.value = true
      const { error } = await deleteCategory(categoryToDelete.value.id as number)
      if (error) {
        alertStore.showAlert(error, 'error')
      } else {
        alertStore.showAlert('Categoría eliminada correctamente', 'success')
        loadCategories()
      }
    }
  } catch {
    alertStore.showAlert('Error al eliminar la categoría', 'error')
  } finally {
    isDeleting.value = false
    deleteDialog.value = false
  }
}

onMounted(() => {
  loadCategories()
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