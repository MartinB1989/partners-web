<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <!-- Header Section -->
        <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center align-start mb-6 ga-3">
          <div class="flex-grow-1">
            <h1 class="text-h4 font-weight-bold mb-2">Métodos de Pago - Vinculaciones</h1>
            <p class="text-body-1 text-medium-emphasis">
              Vincula tus métodos de pago para poder recibir pagos de tus clientes.
              Al vincular Mercado Pago, podrás procesar pagos de forma segura y recibir el dinero directamente en tu cuenta.
            </p>
          </div>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            to="/admin/panel"
            class="flex-sm-shrink-0"
          >
            Atrás
          </v-btn>
        </div>

        <!-- Payment Methods Grid -->
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-card
              elevation="2"
              hover
              class="h-100"
            >
              <v-card-text class="d-flex flex-column align-center pa-6 text-center">
                <!-- Logo -->
                <v-sheet
                  class="d-flex align-center justify-center mb-6"
                  color="transparent"
                  height="100"
                  width="100%"
                >
                  <v-img
                    src="/static/images/mercadopago-logo.webp"
                    alt="Mercado Pago"
                    max-width="200"
                    contain
                  />
                </v-sheet>

                <!-- Title and Description -->
                <h3 class="text-h6 font-weight-bold mb-2">Mercado Pago</h3>
                <p class="text-body-2 text-medium-emphasis mb-6">
                  Acepta pagos con tarjetas de crédito, débito y otros medios de pago
                </p>

                <!-- Action Button -->
                <v-btn
                  color="primary"
                  block
                  size="large"
                  prepend-icon="mdi-eye"
                  to="/admin/payment-methods/mercadopago"
                >
                  Ver
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
})
</script>

