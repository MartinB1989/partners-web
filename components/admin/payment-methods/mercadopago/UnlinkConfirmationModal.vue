<template>
  <v-dialog v-model="localShow" max-width="500" persistent>
    <v-card class="confirmation-modal">
      <v-card-title class="modal-header d-flex align-center pa-6">
        <v-icon color="warning" size="28" class="mr-3">mdi-alert-circle</v-icon>
        <span class="modal-title">¿Desvincular cuenta?</span>
      </v-card-title>

      <v-card-text class="modal-content pa-6">
        <div class="warning-content">
          <v-alert type="warning" variant="tonal" class="mb-4">
            <div>
              <p class="mb-2"><strong>⚠️ Importante:</strong></p>
              <p class="mb-0">
                Una vez desvinculada tu cuenta, el dinero de tus ventas ingresara a la cuenta de la plataforma.
              </p>
            </div>
          </v-alert>

          <div class="consequences-list">
            <h4 class="mb-3">Esto significa que:</h4>
            <div class="consequence-item">
              <v-icon color="error" size="18" class="mr-2">mdi-close-circle</v-icon>
              <span>No recibiras el dinero de forma inmediata</span>
            </div>
            <div class="consequence-item">
              <v-icon color="warning" size="18" class="mr-2">mdi-alert-circle</v-icon>
              <span>Deberás vincular una nueva cuenta para reactivar los cobros inmediatos</span>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="modal-actions pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="outlined"
          color="grey"
          class="mr-3"
          :disabled="unlinking"
          @click="handleCancel"
        >
          <v-icon start>mdi-close</v-icon>
          Cancelar
        </v-btn>
        <v-btn
          color="warning"
          :loading="unlinking"
          :disabled="unlinking"
          @click="handleConfirm"
        >
          <v-icon start>mdi-link-off</v-icon>
          Desvincular cuenta
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  unlinking?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  unlinking: false
})

const emit = defineEmits<Emits>()

const localShow = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

function handleCancel() {
  emit('update:show', false)
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
/* Confirmation Modal */
.confirmation-modal {
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
}

.modal-content {
  background: white;
}

.warning-content {
  color: #5f6368;
}

.consequences-list {
  margin-top: 1rem;
}

.consequences-list h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a1a1a;
}

.consequence-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: #fafbfc;
  border-radius: 8px;
}

.consequence-item span {
  color: #5f6368;
  font-size: 0.95rem;
}

.modal-actions {
  background: #fafbfc;
}
</style>
