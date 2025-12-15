<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-4 ga-3">
          <h1 class="text-h4">Productos</h1>
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
              prepend-icon="mdi-plus"
              class="action-btn"
              to="/admin/products/new-product"
            >
              Crear
            </v-btn>
          </div>
        </div>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="products"
            :loading="loading"
            mobile-breakpoint="md"
            class="elevation-1"
          >
            <template #[`item.active`]="{ item }">
              <v-chip
                :color="item.active ? 'success' : 'error'"
                size="small"
              >
                {{ item.active ? 'Publicado' : 'No publicado' }}
              </v-chip>
            </template>

            <template #[`item.actions`]="{ item }">
              <v-btn
                icon="mdi-pencil"
                variant="text"
                color="primary"
                @click="editProduct(item)"
              />
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="showDeleteModal(item)"
              />
            </template>

            <!-- Vista móvil personalizada -->
            <template #item="{ item }">
              <tr v-if="$vuetify.display.mdAndUp">
                <td>{{ item.title }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.stock }}</td>
                <td>
                  <v-chip
                    :color="item.active ? 'success' : 'error'"
                    size="small"
                  >
                    {{ item.active ? 'Publicado' : 'No publicado' }}
                  </v-chip>
                </td>
                <td>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    color="primary"
                    @click="editProduct(item)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    color="error"
                    @click="showDeleteModal(item)"
                  />
                </td>
              </tr>
              <tr v-else>
                <td colspan="100%">
                  <v-card variant="outlined" class="my-2">
                    <v-card-text>
                      <div class="mb-3">
                        <span class="text-body-1 font-weight-bold">{{ item.title }}</span>
                      </div>
                      <v-divider class="my-2" />
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Precio:</span>
                        <span class="text-body-2 font-weight-medium">${{ item.price }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Stock:</span>
                        <span class="text-body-2 font-weight-medium">{{ item.stock }}</span>
                      </div>
                      <div class="d-flex justify-space-between mb-1">
                        <span class="text-body-2 text-grey-darken-1">Estado:</span>
                        <v-chip
                          :color="item.active ? 'success' : 'error'"
                          size="small"
                        >
                          {{ item.active ? 'Publicado' : 'No publicado' }}
                        </v-chip>
                      </div>
                      <v-divider class="my-2" />
                      <div class="d-flex flex-column ga-2">
                        <v-btn
                          variant="outlined"
                          size="small"
                          prepend-icon="mdi-pencil"
                          color="primary"
                          @click="editProduct(item)"
                        >
                          Editar
                        </v-btn>
                        <v-btn
                          variant="outlined"
                          size="small"
                          prepend-icon="mdi-delete"
                          color="error"
                          @click="showDeleteModal(item)"
                        >
                          Eliminar
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

    <!-- Modal de confirmación para eliminar producto -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el producto <strong>{{ productToDelete?.title }}</strong>?
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
import { useProducts } from '~/composables/services/useProducts'
import type { Product } from '~/types/product'
import { useAlertStore } from '~/stores/alert'
import { useRouter } from 'vue-router'
import type { TableHeader } from '~/types/table-header'

definePageMeta({
  layout: 'admin',
})


const { getMyProducts, deleteProduct } = useProducts()
const alertStore = useAlertStore()
const router = useRouter()

const headers: TableHeader[] = [
  { title: 'Título', key: 'title' },
  { title: 'Precio', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Publicado', key: 'active' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const products = ref<Product[]>([])
const loading = ref<boolean>(false)
const deleteDialog = ref<boolean>(false)
const productToDelete = ref<Product | null>(null)

// Función para cargar los productos
const loadProducts = async (): Promise<void> => {
  loading.value = true
  try {
    const { data, error } = await getMyProducts()
    if (error) {
      console.error('Error al cargar productos:', error)
      alertStore.showAlert('Error al cargar productos. Vuelve a cargar la página', 'error')
    } else {
      products.value = data.data
    }
  } catch (error) {
    console.error('Error al cargar productos:', error)
    alertStore.showAlert('Error al cargar productos. Vuelve a cargar la página', 'error')
  } finally {
    loading.value = false
  }
}

// Función para editar un producto
const editProduct = (product: Product): void => {
  // Navegar a la página de edición
  navigateTo(`/admin/products/edit/${product.id}`)
}

// Función para mostrar el modal de eliminación
const showDeleteModal = (product: Product): void => {
  productToDelete.value = product
  deleteDialog.value = true
}

// Función para confirmar la eliminación del producto
const confirmDelete = async (): Promise<void> => {
  if (productToDelete.value && productToDelete.value.id) {
    try {
      // Llamar a la API para eliminar el producto
      const { error } = await deleteProduct(productToDelete.value.id)
      
      if (error) {
        console.error('Error al eliminar producto:', error)
        alertStore.showAlert('Error al eliminar producto', 'error')
      } else {
        alertStore.showAlert('Producto eliminado correctamente', 'success')
      }
      
      // Recargar los productos
      await loadProducts()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    } finally {
      deleteDialog.value = false
    }
  }
}

// Cargar productos al montar el componente
onMounted(() => {
  loadProducts()
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
