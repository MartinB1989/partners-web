<template>
  <div class="products-page">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">Nuestros Productos</h1>
        </v-col>
      </v-row>

      <!-- Mensaje de error si falla la carga -->
      <v-row v-if="error" justify="center" class="my-8">
        <v-col cols="12">
          <v-alert type="error" variant="tonal">
            {{ error.message }}
            <template #append>
              <v-btn color="error" variant="text" @click="refresh">
                Reintentar
              </v-btn>
            </template>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Loader mientras cargan los productos (solo durante navegación) -->
      <v-row v-else-if="status === 'pending'" justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
          <div class="text-h6 mt-4">Cargando productos...</div>
        </v-col>
      </v-row>

      <!-- Contenido principal con productos -->
      <template v-else-if="data">
        <!-- Mensaje si no hay productos -->
        <v-row v-if="data.data.length === 0" justify="center" class="my-8">
          <v-col cols="12" class="text-center">
            <v-icon icon="mdi-alert-circle-outline" size="64" color="grey"/>
            <div class="text-h6 mt-4">No se encontraron productos</div>
          </v-col>
        </v-row>

        <!-- Lista de productos -->
        <v-data-iterator
          v-else
          :items="data.data"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :items-length="data.meta.total"
        >
          <template #default="{ items }">
            <v-row>
              <v-col
                v-for="(item, index) in items"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="mb-4"
              >
                <ProductCard :product="item.raw as Product" />
              </v-col>
            </v-row>
          </template>

          <!-- Paginación -->
          <template #footer>
            <div class="d-flex align-center justify-center pt-4">
              <v-pagination
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                rounded
              />
            </div>
          </template>
        </v-data-iterator>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import ProductCard from '~/components/app/ProductCard.vue'
import type { Product } from '~/types/product'
import { useProducts } from '~/composables/services/useProducts'

// Composables
const route = useRoute()
const router = useRouter()
const productsService = useProducts()

// Configuración de paginación
const itemsPerPage = 12

// Computed para página actual desde query params
const currentPage = computed({
  get: () => parseInt(route.query.page as string) || 1,
  set: (value) => router.push({ query: { page: value.toString() } })
})

// ✅ SSR: Cargar datos con useAsyncData
const { data, error, status, refresh } = await useAsyncData(
  `products-page-${currentPage.value}`,
  async () => {
    const result = await productsService.getProducts(
      currentPage.value,
      itemsPerPage
    )

    if (result.error) {
      throw createError({
        statusCode: 500,
        message: result.error,
        fatal: false
      })
    }

    return result.data!
  },
  {
    server: true,        // Ejecutar en servidor
    lazy: false,         // Bloquear hasta tener datos
    watch: [currentPage] // Re-fetch en cambio de página
  }
)

// Calcular total de páginas
const totalPages = computed(() => {
  if (!data.value) return 0
  return Math.ceil(data.value.meta.total / itemsPerPage)
})

// ✅ SEO: Meta tags
useHead({
  title: 'Productos',
  meta: [
    { name: 'description', content: 'Descubre nuestra selección de productos frescos y de calidad' }
  ]
})

useSeoMeta({
  ogTitle: 'Productos - Partners',
  ogDescription: 'Descubre nuestra selección de productos frescos y de calidad',
  ogImage: 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/og-image.jpg',
  ogType: 'website'
})
</script>

<style scoped>
.products-page {
  min-height: 80vh;
}
</style>
