<template>
  <v-container class="text-center">
    <v-card class="pa-8 mx-auto my-4" max-width="600">
      <v-icon
        size="64"
        color="primary"
        class="mb-4"
      >
        mdi-tools
      </v-icon>
      <h1 class="text-h4 mb-4">Próximamente</h1>
      <p class="text-body-1 mb-4">Estamos trabajando en esta sección.</p>
      <p class="text-body-2 mb-6">Los datos del carrito y el proceso de compra se procesarán directamente desde nuestro backend.</p>
      <v-btn
        color="primary"
        to="/cart"
      >
        Volver al carrito
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
// Sin lógica de negocio, todos los cálculos se realizarán en el backend
</script> 