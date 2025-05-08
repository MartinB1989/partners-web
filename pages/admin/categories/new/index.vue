<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h5 mb-4">
        Crear Nueva Categoría
      </v-card-title>

      <v-form ref="form" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.level"
              :items="levelOptions"
              label="Nivel de Categoría"
              :rules="[v => !!v || 'El nivel es requerido']"
              @update:model-value="(_: number | null) => handleLevelChange()"
            />
          </v-col>

          <!-- Select de Categoría Padre (visible para nivel 2 y 3) -->
          <v-col v-if="formData.level && formData.level > 1" cols="12" md="6">
            <v-select
              v-model="formData.parentId"
              :items="parentCategories"
              item-title="name"
              item-value="id"
              label="Categoría Padre"
              :rules="parentRules"
              @update:model-value="handleParentChange"
            />
          </v-col>

          <!-- Select de Categoría Hijo (visible solo para nivel 3) -->
          <v-col v-if="formData.level === 3" cols="12" md="6">
            <v-select
              v-model="formData.childId"
              :items="childCategories"
              item-title="name"
              item-value="id"
              label="Categoría Hijo"
              :disabled="!formData.parentId"
              :rules="childRules"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.name"
              label="Nombre de la Categoría"
              :rules="[
                v => !!v || 'El nombre es requerido',
                v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
              ]"
            />
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              color="primary"
              type="submit"
              :loading="loading"
              :disabled="!isFormValid"
            >
              Crear Categoría
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCategories } from '~/composables/services/useCategories'
import type { VForm } from 'vuetify/components'
import type { Category } from '@/types/categories'
import { useAlertStore } from '~/stores/alert'

interface FormData {
  level: number | null
  parentId: number | null
  childId: number | null
  name: string
}

interface LevelOption {
  title: string
  value: number
}

const form = ref<InstanceType<typeof VForm> | null>(null)
const loading = ref(false)

const { createCategory } = useCategories()
const alertStore = useAlertStore()

const formData = ref<FormData>({
  level: null,
  parentId: null,
  childId: null,
  name: ''
})

// Opciones para el selector de nivel
const levelOptions: LevelOption[] = [
  { title: 'Nivel 1 - Categoría Principal', value: 1 },
  { title: 'Nivel 2 - Subcategoría', value: 2 },
  { title: 'Nivel 3 - Sub-subcategoría', value: 3 }
]

// Simulación de categorías padre (esto vendrá de la API)
const parentCategories = ref<Category[]>([
  { id: 1, name: 'Tecnología', level: 1 },
  { id: 2, name: 'Computación', level: 1, parentId: 1 },
  { id: 3, name: 'Celulares', level: 2, parentId: 1 }
])

// Categorías hijo filtradas según el padre seleccionado
const childCategories = computed(() => {
  if (!formData.value.parentId) return []
  return parentCategories.value.filter(cat => cat.parentId === formData.value.parentId)
})

// Reglas de validación para el campo de categoría padre
const parentRules = computed(() => {
  if (formData.value.level === 1) return []
  return [(v: unknown) => !!v || 'La categoría padre es requerida']
})

// Reglas de validación para el campo de categoría hijo
const childRules = computed(() => {
  if (formData.value.level !== 3) return []
  return [(v: unknown) => !!v || 'La categoría hijo es requerida']
})

// Validación general del formulario
const isFormValid = computed(() => {
  const baseValidation = formData.value.level && formData.value.name

  if (formData.value.level === 1) {
    return baseValidation
  }

  if (formData.value.level === 2) {
    return baseValidation && formData.value.parentId
  }

  if (formData.value.level === 3) {
    return baseValidation && formData.value.parentId && formData.value.childId
  }

  return false
})

// Manejar cambio de nivel
const handleLevelChange = () => {
  formData.value.parentId = null
  formData.value.childId = null
}

// Manejar cambio de categoría padre
const handleParentChange = () => {
  formData.value.childId = null
}

// Manejar envío del formulario
const handleSubmit = async () => {
  if (!form.value) return
  
  const { valid } = await form.value.validate()
  
  if (!valid) return

  loading.value = true
  try {
    // Para nivel 3, usamos el childId como parentId final
    const finalParentId = formData.value.level === 3 
      ? formData.value.childId 
      : formData.value.parentId

    const dataToSubmit = {
      level: formData.value.level,
      parentId: finalParentId,
      name: formData.value.name
    }
    
    const { data, error } = await createCategory(dataToSubmit as Category)
    if (error) {
      console.error('Error al crear la categoría:', error)
      alertStore.showAlert(error, 'error')
    } else {
      console.log('Categoría creada:', data)
      alertStore.showAlert('Categoría creada correctamente', 'success')
    }
    // Aquí irá la lógica para enviar los datos a la API
    console.log('Datos del formulario:', dataToSubmit)
  } catch (error) {
    console.error('Error al crear la categoría:', error)
  } finally {
    loading.value = false
  }
}
</script>



