<template>
  <v-container class="failure-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 text-center" elevation="2">
          <v-icon size="80" color="error" class="mb-4">
            mdi-close-circle
          </v-icon>

          <h1 class="text-h4 mb-2">Pago no procesado</h1>

          <v-divider class="my-4" />

          <div class="mb-4">
            <p class="text-body-1 mb-2">
              Lo sentimos, no se pudo procesar su pago.
            </p>
            <p class="text-body-1 mb-4">
              Por favor, intente nuevamente o utilice otro método de pago.
            </p>

            <v-alert
              type="info"
              variant="tonal"
              class="text-left my-4"
            >
              <p class="text-body-2 mb-2">
                <strong>Posibles causas:</strong>
              </p>
              <ul class="text-body-2">
                <li>Fondos insuficientes</li>
                <li>Datos de pago incorrectos</li>
                <li>Problemas con la entidad bancaria</li>
                <li>Cancelación del proceso de pago</li>
              </ul>
            </v-alert>
          </div>

          <v-divider class="my-4" />

          <div class="d-flex flex-column gap-3">
            <v-btn
              color="primary"
              size="large"
              to="/checkout"
              variant="flat"
            >
              Intentar nuevamente
            </v-btn>

            <v-btn
              color="secondary"
              size="large"
              to="/products"
              variant="outlined"
            >
              Volver a productos
            </v-btn>

            <v-btn
              color="grey"
              size="large"
              to="/"
              variant="text"
            >
              Ir al inicio
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
</script>

<style scoped>
.failure-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.gap-3 {
  gap: 12px;
}
</style>
