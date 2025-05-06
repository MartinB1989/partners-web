<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Productos</h1>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="products"
            :loading="loading"
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
                @click="deleteProduct(item)"
              />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useProducts } from '~/composables/services/useProducts'
import type { Product } from '~/types/product'
definePageMeta({
  layout: 'admin',
})

interface TableHeader {
  title: string
  key: string
  sortable?: boolean
}

const { getMyProducts } = useProducts()

const headers: TableHeader[] = [
  { title: 'Título', key: 'title' },
  { title: 'Precio', key: 'price' },
  { title: 'Stock', key: 'stock' },
  { title: 'Publicado', key: 'active' },
  { title: 'Acciones', key: 'actions', sortable: false },
]

const products = ref<Product[]>([])
const loading = ref<boolean>(false)

// Función para cargar los productos
const loadProducts = async (): Promise<void> => {
  loading.value = true
  try {
    const { data, error } = await getMyProducts()
    if (error) {
      console.error('Error al cargar productos:', error)
    } else {
      console.log(data)
      products.value = data.data
    }
  } catch (error) {
    console.error('Error al cargar productos:', error)
  } finally {
    loading.value = false
  }
}

// Función para editar un producto
const editProduct = (product: Product): void => {
  // Navegar a la página de edición
  navigateTo(`/admin/products/edit/${product.id}`)
}

// Función para eliminar un producto
const deleteProduct = async (product: Product): Promise<void> => {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      // Aquí iría la llamada a la API para eliminar el producto
      // await $fetch(`/api/products/${product.id}`, { method: 'DELETE' })
      console.log(product)
      await loadProducts()
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    }
  }
}

// Cargar productos al montar el componente
onMounted(() => {
  loadProducts()
})
</script>
