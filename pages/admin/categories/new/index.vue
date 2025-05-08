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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
              label="Categoría Hijo"
              :disabled="!formData.parentId"
              :rules="childRules"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model="formData.name"
              label="Nombre de la Categoría"
              variant="outlined"
              :rules="[
                v => !!v || 'El nombre es requerido',
                v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
              ]"
            />
          </v-col>

          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              class="mr-2"
              prepend-icon="mdi-arrow-left"
              @click="() => router.back()"
            >
              Atrás
            </v-btn>
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
import { useRouter } from 'vue-router'
import { useCategories } from '~/composables/services/useCategories'
import type { VForm } from 'vuetify/components'
import type { Category } from '@/types/categories'
import { useAlertStore } from '~/stores/alert'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()

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
const loadingCategories = ref(false)

const { createCategory, filterCategories } = useCategories()
const alertStore = useAlertStore()

const formData = ref<FormData>({
  level: 1,
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
const parentCategories = ref<Category[]>([])

// Categorías hijo filtradas según el padre seleccionado
const childCategories = computed(() => {
  if (!formData.value.parentId) return []
  const parentCategory = parentCategories.value.find(cat => cat.id === formData.value.parentId)
  return parentCategory?.children || []
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

    const { error } = await createCategory(dataToSubmit as Category)
    if (error) {
      alertStore.showAlert(error, 'error')
    } else {
      alertStore.showAlert('Categoría creada correctamente', 'success')
      // Limpiar el formulario
      formData.value = {
        level: 1,
        name: '',
        parentId: null,
        childId: null
      }
      form.value?.resetValidation()
      await loadCategories()
    }
  } catch {
    alertStore.showAlert('Error al crear la categoría. Vuelve a intentarlo', 'error')
  } finally {
    loading.value = false
  }
}

const loadCategories = async (): Promise<void> => {
  loadingCategories.value = true
  try {
    const { data, error } = await filterCategories({ level: 1 })
    if (error) {
      alertStore.showAlert(error, 'error')
    } else {
      parentCategories.value = data
    }
  } catch {
    alertStore.showAlert('Error al cargar categorías. Recarga la página', 'error')
  } finally {
    loadingCategories.value = false
  }
}

onMounted(async () => {
  await loadCategories()
})
</script>



