<template>
  <v-container class="pending-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 text-center" elevation="2">
          <v-icon size="80" color="warning" class="mb-4">
            mdi-clock-alert
          </v-icon>

          <h1 class="text-h4 mb-2">Pago pendiente de aprobación</h1>

          <v-divider class="my-4" />

          <div class="mb-4">
            <p class="text-body-1 mb-2">
              Su pago está siendo procesado.
            </p>
            <p class="text-body-1 mb-4">
              Recibirá un correo electrónico cuando se confirme el estado de su pedido.
            </p>

            <v-alert
              type="warning"
              variant="tonal"
              class="text-left my-4"
            >
              <p class="text-body-2 mb-2">
                <strong>¿Qué significa esto?</strong>
              </p>
              <p class="text-body-2 mb-2">
                Algunos métodos de pago requieren tiempo adicional para su verificación y aprobación.
              </p>
              <p class="text-body-2">
                El proceso puede demorar entre unas horas y algunos días hábiles, dependiendo del medio de pago utilizado.
              </p>
            </v-alert>

            <v-alert
              type="info"
              variant="outlined"
              class="text-left my-4"
            >
              <p class="text-body-2">
                Le notificaremos por correo electrónico cuando su pago sea confirmado o rechazado.
              </p>
            </v-alert>
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
</script>

<style scoped>
.pending-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
}

.gap-3 {
  gap: 12px;
}
</style>
