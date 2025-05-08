<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">Editar Categoría</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="categoryName"
            label="Nombre de la categoría"
            variant="outlined"
            :rules="[v => !!v || 'El nombre es requerido']"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" variant="text" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" variant="text" @click="handleSubmit">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCategories } from '~/composables/services/useCategories'
import { useAlertStore } from '~/stores/alert'

const props = defineProps<{
  modelValue: boolean
  categoryId: number
  categoryName: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'categoryUpdated'): void
}>()

const dialog = ref(props.modelValue)
const categoryName = ref(props.categoryName)
const { updateCategory } = useCategories()
const alertStore = useAlertStore()

watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
})

watch(() => props.categoryName, (newValue) => {
  categoryName.value = newValue
})

const closeDialog = () => {
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  try {
    const { error } = await updateCategory(props.categoryId, categoryName.value)
    if (error) {
      alertStore.showAlert('Error al actualizar la categoría', 'error')
      return
    }
    alertStore.showAlert('Categoría actualizada exitosamente', 'success')
    emit('categoryUpdated')
    closeDialog()
  } catch (error) {
    console.error('Error al actualizar la categoría:', error)
    alertStore.showAlert('Error al actualizar la categoría', 'error')
  }
}
</script>
