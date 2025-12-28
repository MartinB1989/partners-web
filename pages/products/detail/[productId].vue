<template>
  <div class="product-detail-page">
    <v-container>
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

        <!-- Galería de imágenes (lazy loaded) -->
        <v-col cols="12" md="6" lg="5">
          <Suspense>
            <template #default>
              <AppProductGallery :images="productImages" :product-title="product.title" />
            </template>
            <template #fallback>
              <v-skeleton-loader type="image" height="400" />
            </template>
          </Suspense>
        </v-col>

        <!-- Información del producto (carga inmediata - crítico) -->
        <v-col cols="12" md="6" lg="7">
          <AppProductInfo
            :title="product.title"
            :price="product.price"
            :stock="product.stock"
            :product-id="Number(route.params.productId)"
          />
        </v-col>

        <!-- Sección de pestañas con la descripción (lazy loaded) -->
        <v-col cols="12" class="mt-8 border border-1 border-opacity-50 rounded-lg">
          <Suspense>
            <template #default>
              <AppProductTabs
                :description="product.description"
                :tabs="[{ label: 'Descripción', value: 'description' }]"
              />
            </template>
            <template #fallback>
              <v-skeleton-loader type="article" />
            </template>
          </Suspense>
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
import { computed, watch, defineAsyncComponent } from 'vue'
import type { ProductImage } from '~/types/product'
import { useProducts } from '~/composables/services/useProducts'

// ✅ Lazy load componentes pesados (code splitting)
const AppProductGallery = defineAsyncComponent(() =>
  import('~/components/app/AppProductGallery.vue')
)

const AppProductTabs = defineAsyncComponent(() =>
  import('~/components/app/AppProductTabs.vue')
)

// Importar componente crítico normalmente
import AppProductInfo from '~/components/app/AppProductInfo.vue'

// Composables
const route = useRoute()
const productsService = useProducts()
const config = useRuntimeConfig()

// ✅ SSR: Cargar datos del producto con useAsyncData
const { data: product, error, refresh } = await useAsyncData(
  `product-${route.params.productId}`,
  async () => {
    const productId = route.params.productId as string

    if (!productId || isNaN(Number(productId))) {
      throw createError({
        statusCode: 400,
        message: 'ID de producto no válido',
        fatal: false
      })
    }

    const result = await productsService.getProductById(productId)

    if (result.error || !result.data) {
      throw createError({
        statusCode: 404,
        message: 'Producto no encontrado',
        fatal: false
      })
    }

    return result.data
  },
  {
    server: true,
    lazy: false
  }
)

// Calcular imágenes del producto
const productImages = computed<ProductImage[]>(() => {
  if (!product.value || !product.value.images || product.value.images.length === 0) {
    // Si no hay imágenes, devuelve una imagen por defecto
    return [{
      url: 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/imagen-de-no-hay-imagen.png',
      key: 'default',
      main: true,
      order: 0
    }]
  }

  // Ordenar imágenes por el campo 'order'
  return [...product.value.images].sort((a, b) => a.order - b.order)
})

// ✅ SEO: Meta tags dinámicos mejorados basados en producto
useHead(() => ({
  title: product.value ? `${product.value.title}` : 'Producto',
  meta: [
    {
      name: 'description',
      content: product.value?.description?.substring(0, 160) || 'Producto de Partners'
    },
    {
      name: 'keywords',
      content: product.value ? `${product.value.title}, comprar online, Partners` : 'productos, comprar online'
    }
  ],
  link: [
    {
      rel: 'canonical',
      href: `${config.public.siteUrl}/products/detail/${product.value?.id || route.params.productId}`
    }
  ],
  // ✅ JSON-LD Structured Data mejorado para Google Shopping
  script: product.value ? [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.value.title,
        description: product.value.description,
        image: productImages.value.map(img => img.url),
        sku: product.value.sku || product.value.id,
        brand: {
          '@type': 'Brand',
          name: 'Partners'
        },
        offers: {
          '@type': 'Offer',
          url: `${config.public.siteUrl}/products/detail/${product.value.id}`,
          price: product.value.price,
          priceCurrency: 'ARS',
          availability: product.value.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'Partners'
          }
        }
      })
    }
  ] : []
}))

// ✅ Open Graph meta tags mejorados
watch(product, (newProduct) => {
  if (newProduct) {
    useSeoMeta({
      ogTitle: newProduct.title,
      ogDescription: newProduct.description?.substring(0, 200) || '',
      ogImage: productImages.value[0]?.url || '',
      ogUrl: `${config.public.siteUrl}/products/detail/${newProduct.id}`,
      ogType: 'website',
      twitterCard: 'summary_large_image'
    })
  }
}, { immediate: true })
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
