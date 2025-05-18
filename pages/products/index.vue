<template>
  <div class="products-page">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h4 mb-4">Nuestros Productos</h1>
        </v-col>
      </v-row>

      <!-- Loader para cuando se están cargando los productos -->
      <v-row v-if="loading" justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
          <div class="mt-4 text-body-1">Cargando productos...</div>
        </v-col>
      </v-row>

      <!-- Mensaje de error si falla la carga -->
      <v-row v-else-if="error" justify="center" class="my-8">
        <v-col cols="12">
          <v-alert type="error" variant="tonal">
            {{ error }}
            <template #append>
              <v-btn color="error" variant="text" @click="loadProducts">
                Reintentar
              </v-btn>
            </template>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Contenido principal con productos -->
      <template v-else>
        <v-data-iterator
          :items="products"
          :items-per-page="itemsPerPage"
          :page="currentPage"
          :items-length="totalItems"
          @update:page="onPageChange"
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
                @update:model-value="onPageChange"
              />
            </div>
          </template>
        </v-data-iterator>

        <!-- Mensaje si no hay productos -->
        <v-row v-if="products.length === 0" justify="center" class="my-8">
          <v-col cols="12" class="text-center">
            <v-icon icon="mdi-alert-circle-outline" size="64" color="grey"/>
            <div class="text-h6 mt-4">No se encontraron productos</div>
          </v-col>
        </v-row>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue';

// Importamos los componentes y servicios
import ProductCard from '~/components/app/ProductCard.vue';
import { useProducts } from '~/composables/services/useProducts';
import type { Product } from '~/types/product';

// Variables de estado
const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(12);
const totalItems = ref(0);

// Inicializamos el servicio de productos
const productsService = useProducts();

// Calculamos el total de páginas
const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

// Función para cargar productos
async function loadProducts() {
  loading.value = true;
  error.value = null;

  try {
    const { data, error: requestError } = await productsService.getProducts(
      currentPage.value,
      itemsPerPage.value
    );

    if (requestError) {
      error.value = requestError;
      return;
    }

    if (data) {
      products.value = data.data;
      totalItems.value = data.meta.total;
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cargar productos';
  } finally {
    loading.value = false;
  }
}

// Función para manejar cambios de página
async function onPageChange(page: number) {
  currentPage.value = page;
  await loadProducts();
}

// Cargamos los productos al montar el componente
onMounted(() => {
  loadProducts();
});
</script>

<style scoped>
.products-page {
  min-height: 80vh;
}
</style>
