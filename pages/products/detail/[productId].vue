<template>
  <div class="product-detail-page">
    <v-container>
      <!-- Mensaje de error si falla la carga -->
      <v-row v-if="error" justify="center" class="my-8">
        <v-col cols="12">
          <v-alert type="error" variant="tonal">
            {{ error }}
            <template #append>
              <v-btn color="error" variant="text" @click="loadProduct">
                Reintentar
              </v-btn>
            </template>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Contenido del detalle del producto -->
      <v-row v-else-if="product">
        <v-col cols="12" class="mb-4">
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="text"
            color="primary"
            to="/products"
          >
            Volver a productos
          </v-btn>
        </v-col>

        <!-- Galería de imágenes -->
        <v-col cols="12" md="6" lg="5">
          <AppProductGallery :images="productImages" />
        </v-col>

        <!-- Información del producto -->
        <v-col cols="12" md="6" lg="7">
          <AppProductInfo
            :title="product.title"
            :price="product.price"
            :stock="product.stock"
            :formatted-price="formatPrice(product.price)"
            :product-id="Number(route.params.productId)"
          />
        </v-col>
        
        <!-- Sección de pestañas con la descripción y otras informaciones -->
        <v-col cols="12" class="mt-8 border border-1 border-opacity-50 rounded-lg">
          <AppProductTabs 
            :description="product.description"
            :tabs="[{ label: 'Descripción', value: 'description' }]"
          />
        </v-col>
      </v-row>

      <!-- Mensaje si no existe el producto -->
      <v-row v-else justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <v-icon icon="mdi-alert-circle-outline" size="64" color="grey"/>
          <div class="text-h6 mt-4">Producto no encontrado</div>
          <v-btn
            class="mt-4"
            color="primary"
            to="/products"
          >
            Ver todos los productos
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProducts } from '~/composables/services/useProducts';
import { useLoaderStore } from '~/stores/loader';
import type { Product, ProductImage } from '~/types/product';

// Importar los componentes
import AppProductGallery from '~/components/app/AppProductGallery.vue';
import AppProductInfo from '~/components/app/AppProductInfo.vue';
import AppProductTabs from '~/components/app/AppProductTabs.vue';

const route = useRoute();
const productsService = useProducts();
const loaderStore = useLoaderStore();

// Estado
const product = ref<Product | null>(null);
const error = ref<string | null>(null);

// Calcular imágenes del producto
const productImages = computed<ProductImage[]>(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    // Si no hay imágenes, devuelve una imagen por defecto
    return [{
      // url: 'https://via.placeholder.com/500x500?text=Sin+imagen',
      url: 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/imagen-de-no-hay-imagen.png',
      key: 'default',
      main: true,
      order: 0
    }];
  }
  
  // Ordenar imágenes por el campo 'order'
  return [...product.value.images].sort((a, b) => a.order - b.order);
});

// Cargar el producto
async function loadProduct() {
  const productId = route.params.productId as string;
  if (!productId) {
    error.value = 'ID de producto no válido';
    return;
  }

  loaderStore.startLoading('Cargando producto...');
  error.value = null;

  try {
    const { data, error: productError } = await productsService.getProductById(productId);

    if (productError) {
      error.value = productError;
      return;
    }

    if (data) {
      product.value = data;
    } else {
      error.value = 'No se encontró el producto';
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error al cargar el producto';
  } finally {
    loaderStore.stopLoading();
  }
}

// Función para formatear el precio
function formatPrice(price: number): string {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Cargar el producto al montar el componente
onMounted(() => {
  loadProduct();
});
</script>

<style scoped>
.product-detail-page {
  min-height: 80vh;
}

.thumbnails-container {
  display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 8px 4px;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: thin; /* Firefox */
}

.thumbnails-container::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background: #d0d0d0;
  border-radius: 10px;
}

.thumbnails-container::-webkit-scrollbar-thumb:hover {
  background: #a0a0a0;
}

.thumbnail-card {
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 0 0 auto;
  min-width: 70px;
  margin: 0 2px;
}

.thumbnail-card:hover {
  transform: scale(1.05);
}

.product-description {
  white-space: pre-line;
}
</style>
