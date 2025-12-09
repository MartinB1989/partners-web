<template>
  <v-container class="success-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 text-center" elevation="2">
          <v-icon size="80" color="success" class="mb-4">
            mdi-check-circle
          </v-icon>

          <h1 class="text-h4 mb-2">¡Compra realizada con éxito!</h1>

          <v-divider class="my-4" />

          <div class="mb-4">
            <p class="text-body-1 mb-2">
              Su orden ha sido procesada correctamente.
            </p>
            <p class="text-body-1 mb-4">
              Recibirá un correo electrónico de confirmación con los detalles de su pedido.
            </p>

            <v-card v-if="orderNumber" variant="tonal" color="primary" class="pa-4 my-4">
              <p class="text-subtitle-2 mb-1">Número de orden</p>
              <p class="text-h5 font-weight-bold">{{ orderNumber }}</p>
            </v-card>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex flex-column gap-3">
            <v-btn
              color="primary"
              size="large"
              to="/"
              variant="flat"
            >
              Volver al inicio
            </v-btn>

            <v-btn
              color="secondary"
              size="large"
              to="/products"
              variant="outlined"
            >
              Seguir comprando
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const route = useRoute()

// Obtener el número de orden del query param "external_reference"
const orderNumber = computed(() => route.query.external_reference as string || null)
</script>

<style scoped>
.success-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.gap-3 {
  gap: 12px;
}
</style>