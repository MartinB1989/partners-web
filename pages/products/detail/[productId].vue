<template>
  <div class="product-detail-page">
    <v-container>
      <!-- Loader mientras se carga el producto -->
      <v-row v-if="loading" justify="center" class="my-8">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
          <div class="mt-4 text-body-1">Cargando producto...</div>
        </v-col>
      </v-row>

      <!-- Mensaje de error si falla la carga -->
      <v-row v-else-if="error" justify="center" class="my-8">
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
          <v-card flat>
            <v-window v-model="currentImage">
              <v-window-item
                v-for="(image, i) in productImages"
                :key="i"
              >
                <v-img
                  :src="image.url"
                  height="400"
                  class="rounded-lg"
                  contain
                />
              </v-window-item>
            </v-window>

            <div class="mt-4 d-flex align-center overflow-x-auto py-2 gap-2">
              <v-card
                v-for="(image, i) in productImages"
                :key="i"
                :elevation="currentImage === i ? 4 : 0"
                :class="currentImage === i ? 'border border-primary' : ''"
                class="thumbnail-card"
                @click="currentImage = i"
              >
                <v-img
                  :src="image.url"
                  height="70"
                  width="70"
                  contain
                  class="rounded"
                />
              </v-card>
            </div>
          </v-card>
        </v-col>

        <!-- Información del producto -->
        <v-col cols="12" md="6" lg="7">
          <div class="d-flex flex-column h-100">
            <h1 class="text-h4 font-weight-bold">{{ product.title }}</h1>
            
            <div class="my-4">
              <v-chip
                v-if="product.stock > 0"
                color="success"
                variant="outlined"
                class="mr-2"
              >
                En stock ({{ product.stock }} disponibles)
              </v-chip>
              <v-chip
                v-else
                color="error"
                variant="outlined"
              >
                Agotado
              </v-chip>
            </div>
            
            <div class="text-h4 font-weight-bold primary--text my-4">
              ${{ formatPrice(product.price) }}
            </div>
            
            <div class="mt-auto">
              <v-btn
                color="primary"
                size="large"
                block
                :disabled="product.stock <= 0"
                prepend-icon="mdi-cart-plus"
                @click="addToCart"
              >
                Agregar al carrito
              </v-btn>
            </div>
          </div>
        </v-col>
        
        <!-- Sección de pestañas con la descripción y otras informaciones -->
        <v-col cols="12" class="mt-8 border border-1 border-opacity-50 rounded-lg">
          <v-card flat>
            <v-tabs
              v-model="activeTab"
              color="primary"
              align-tabs="center"
              grow
            >
              <v-tab value="description">Descripción</v-tab>
            </v-tabs>
            
            <v-card-text class="mt-4">
              <v-window v-model="activeTab">
                <!-- Pestaña de descripción -->
                <v-window-item value="description">
                  <div class="product-description text-body-1">
                    {{ product.description }}
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
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
import type { Product, ProductImage } from '~/types/product';

const route = useRoute();
const productsService = useProducts();

// Estado
const product = ref<Product | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const currentImage = ref(0);
const activeTab = ref('description');

// Calcular imágenes del producto
const productImages = computed<ProductImage[]>(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    // Si no hay imágenes, devuelve una imagen por defecto
    return [{
      url: 'https://via.placeholder.com/500x500?text=Sin+imagen',
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
    loading.value = false;
    return;
  }

  loading.value = true;
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
    loading.value = false;
  }
}

// Función para formatear el precio
function formatPrice(price: number): string {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Función para agregar al carrito (solo placeholder por ahora)
function addToCart() {
  // Esta funcionalidad se implementará más adelante
  console.log('Agregar al carrito:', product.value?.id);
  // Placeholder para futuro desarrollo
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

.thumbnail-card {
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail-card:hover {
  transform: scale(1.05);
}

.product-description {
  white-space: pre-line;
}
</style>
