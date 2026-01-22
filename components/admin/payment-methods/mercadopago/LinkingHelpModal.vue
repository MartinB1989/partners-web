<template>
  <v-dialog
    :model-value="show"
    max-width="600"
    @update:model-value="$emit('update:show', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center bg-grey-lighten-4">
        <v-icon color="info" size="24" class="mr-2">mdi-help-circle</v-icon>
        <span class="text-h6">¿Problemas para vincular tu cuenta?</span>
      </v-card-title>

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          Si no puedes realizar la vinculación es posible que:
        </p>

        <div class="mb-4">
          <div class="d-flex align-start mb-4">
            <v-icon color="warning" class="mr-3 mt-1 flex-shrink-0">mdi-alert-circle-outline</v-icon>
            <div class="text-body-1">
              Tu cuenta de Mercado Pago no cumple los requisitos para poder realizar esta acción.
              Puedes ver los requisitos
              <a
                href="https://www.mercadopago.com.ar/developers/es/docs/split-payments/prerequisites"
                target="_blank"
                class="text-primary text-decoration-underline"
              >
                aquí
              </a>
            </div>
          </div>

          <div class="d-flex align-start">
            <v-icon color="warning" class="mr-3 mt-1 flex-shrink-0">mdi-link-variant-off</v-icon>
            <div class="text-body-1">
              Te has vinculado antes y tienes una desvinculación previa. Puedes ver tus vinculaciones en Mercado Pago en
              <a
                :href="mpUnlinkUrl"
                target="_blank"
                class="text-primary text-decoration-underline"
              >
                este link
              </a>
            </div>
          </div>
        </div>

        <v-alert type="info" variant="tonal" density="compact">
          <div class="text-body-2">
            Si el problema persiste, contacta con soporte técnico
          </div>
        </v-alert>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          color="primary"
          variant="flat"
          @click="$emit('update:show', false)"
        >
          Entendido
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
}>()

defineEmits<{
  'update:show': [value: boolean]
}>()

const runtimeConfig = useRuntimeConfig()
const mpUnlinkUrl = computed(() => runtimeConfig.public.mpUnlinkAuthSplit)
</script>
