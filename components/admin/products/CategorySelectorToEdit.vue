<template>
  <div>
    <h3 class="text-subtitle-1 mb-2">Categorías del producto</h3>
    <p class="text-caption mb-4">
      Selecciona al menos 1 categoría principal (nivel 1) y máximo 3 categorías en total. 
      Las subcategorías (niveles 2 y 3) son opcionales.
    </p>
    
    <div v-if="loadingCategories" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate color="primary" />
    </div>
    
    <div v-else>
      <v-alert
        v-if="selectedCategories.length >= 3"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Has alcanzado el límite máximo de 3 categorías
      </v-alert>
      
      <!-- Lista de categorías seleccionadas actual -->
      <div v-if="initialProductCategories.length > 0" class="mb-6">
        <h4 class="text-subtitle-2 mb-2">Categorías actuales:</h4>
        <v-chip-group>
          <v-chip
            v-for="category in initialProductCategories"
            :key="category.category.id"
            color="primary"
            closable
            @click:close="removeInitialCategory(category.category.id)"
          >
            <template v-if="category.category.level === 3">
              {{ 
                category.category.parent?.parent?.name +
                ' > ' + 
                category.category.parent?.name +
                ' > ' + 
                category.category.name
              }}
            </template>
            <template v-else-if="category.category.level === 2">
              {{ category.category.parent?.name + ' > ' + category.category.name }}
            </template>
            <template v-else>
              {{ category.category.name }}
            </template>
          </v-chip>
        </v-chip-group>
      </div>
      
      <!-- Agregar nuevas categorías -->
      <h4 class="text-subtitle-2 mb-2">Agregar categoría:</h4>
      <div 
        v-for="(categorySelector, index) in categorySelectors" 
        :key="`selector-${index}`"
        class="mb-4"
      >
        <!-- Selector de nivel 1 -->
        <v-select
          v-model="categorySelector.level1"
          :items="level1Categories"
          item-title="name"
          item-value="id"
          label="Categoría principal (requerida)"
          variant="outlined"
          :rules="[v => !!v || 'Al menos una categoría principal es requerida']"
          :disabled="totalSelectedCategories >= 3 && !categorySelector.level1"
          @update:model-value="() => handleLevel1Change(index)"
        />
        
        <!-- Selector de nivel 2 -->
        <v-select
          v-if="categorySelector.level1"
          v-model="categorySelector.level2"
          :items="getLevel2Categories(categorySelector.level1)"
          item-title="name"
          item-value="id"
          label="Subcategoría (opcional)"
          variant="outlined"
          class="mt-2"
          @update:model-value="() => handleLevel2Change(index)"
        />
        
        <!-- Selector de nivel 3 -->
        <v-select
          v-if="categorySelector.level2"
          v-model="categorySelector.level3"
          :items="getLevel3Categories(categorySelector.level2)"
          item-title="name"
          item-value="id"
          label="Sub-subcategoría (opcional)"
          variant="outlined"
          class="mt-2"
          @update:model-value="() => handleLevel3Change(index)"
        />
        
        <!-- Botón para eliminar selector -->
        <div class="d-flex justify-end mt-1">
          <v-btn
            v-if="index > 0 || categorySelector.level1"
            size="small"
            color="error"
            variant="text"
            @click="removeCategorySelector(index)"
          >
            Quitar
          </v-btn>
        </div>
      </div>
      
      <!-- Botón para agregar más categorías -->
      <div class="d-flex justify-end mt-4">
        <v-btn
          v-if="totalSelectedCategories < 3 && canAddMore"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-plus"
          @click="addCategorySelector"
        >
          Agregar otra categoría
        </v-btn>
      </div>
      
      <!-- Lista de categorías nuevas seleccionadas -->
      <div v-if="selectedCategories.length > 0" class="mt-6">
        <h4 class="text-subtitle-2 mb-2">Nuevas categorías seleccionadas:</h4>
        <v-chip-group>
          <v-chip
            v-for="category in selectedCategories"
            :key="category.id"
            color="primary"
            variant="outlined"
            closable
            @click:close="removeSelectedCategory(category.id)"
          >
            <template v-if="category.level === 3">
              {{ getFullCategoryPath(category.id) }}
            </template>
            <template v-else-if="category.level === 2">
              {{ getParentCategoryName(category.parentId) }} > {{ category.name }}
            </template>
            <template v-else>
              {{ category.name }}
            </template>
          </v-chip>
        </v-chip-group>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCategories } from '~/composables/services/useCategories'

const props = defineProps({
  initialProductCategories: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:categories'])

const { filterCategories } = useCategories()
const loadingCategories = ref(true)
const allCategories = ref([]) // Categorías de nivel 1 con sus hijos
const level2WithChildren = ref([]) // Categorías de nivel 2 con sus hijos

// Convertir categorías iniciales del producto para usarlas internamente
const initialCategories = ref(props.initialProductCategories || [])

// Categorías filtradas por nivel
const level1Categories = computed(() => {
  return allCategories.value.filter(c => c.level === 1)
})

// Estructura para los selectores de categorías
const categorySelectors = ref([
  { level1: null, level2: null, level3: null }
])

// Lista de IDs de categorías seleccionadas (nuevas)
const selectedCategories = ref([])

// Total de categorías seleccionadas (iniciales + nuevas)
const totalSelectedCategories = computed(() => {
  return initialCategories.value.length + selectedCategories.value.length
})

// Función para obtener las subcategorías de nivel 2 para un ID de categoría padre
const getLevel2Categories = (parentId) => {
  const parentCategory = allCategories.value.find(c => c.id === parentId)
  return parentCategory?.children || []
}

// Función para obtener las subcategorías de nivel 3 para un ID de categoría padre de nivel 2
const getLevel3Categories = (parentId) => {
  const level2Category = level2WithChildren.value.find(c => c.id === parentId)
  return level2Category?.children || []
}

// ¿Se puede añadir más selectores?
const canAddMore = computed(() => {
  return categorySelectors.value.every(selector => selector.level1 !== null)
})

// Actualizar la lista de categorías seleccionadas y emitir el evento
const updateSelectedCategories = () => {
  const categories = []
  
  for (const selector of categorySelectors.value) {
    if (selector.level3) {
      // Si hay categoría de nivel 3 seleccionada, añadirla
      const category = findCategoryById(selector.level3)
      if (category) categories.push(category)
    } else if (selector.level2) {
      // Si no hay nivel 3 pero hay nivel 2, añadir el nivel 2
      const category = findCategoryById(selector.level2)
      if (category) categories.push(category)
    } else if (selector.level1) {
      // Si solo hay nivel 1, añadir el nivel 1
      const category = findCategoryById(selector.level1)
      if (category) categories.push(category)
    }
  }
  
  selectedCategories.value = categories
  
  // Emitir todas las categorías (iniciales + nuevas)
  const allCategoryIds = [
    ...initialCategories.value.map(cat => cat.category.id),
    ...categories.map(cat => cat.id)
  ]
  
  emit('update:categories', allCategoryIds)
}

// Buscar una categoría por ID en toda la estructura
const findCategoryById = (id) => {
  // Buscar en nivel 1
  const level1 = allCategories.value.find(c => c.id === id)
  if (level1) return level1
  
  // Buscar en nivel 2 dentro de las categorías anidadas
  for (const cat1 of allCategories.value) {
    if (cat1.children) {
      const level2 = cat1.children.find(c => c.id === id)
      if (level2) return level2
    }
  }
  
  // Buscar en nivel 3 dentro de level2WithChildren
  for (const cat2 of level2WithChildren.value) {
    if (cat2.children) {
      const level3 = cat2.children.find(c => c.id === id)
      if (level3) return level3
    }
  }
  
  return null
}

// Obtener el nombre de una categoría padre por su ID
const getParentCategoryName = (parentId) => {
  if (!parentId) return ''
  const category = allCategories.value.find(c => c.id === parentId)
  return category ? category.name : ''
}

// Obtener la ruta completa de una categoría de nivel 3
const getFullCategoryPath = (categoryId) => {
  // Buscar la categoría de nivel 3
  let level3Category = null
  let level2ParentId = null
  
  // Buscar en todas las categorías de nivel 2
  for (const cat2 of level2WithChildren.value) {
    if (cat2.children) {
      const foundLevel3 = cat2.children.find(c => c.id === categoryId)
      if (foundLevel3) {
        level3Category = foundLevel3
        level2ParentId = cat2.id
        break
      }
    }
  }
  
  if (!level3Category || !level2ParentId) return ''
  
  // Ahora buscar la categoría de nivel 2
  let level2Category = null
  let level1ParentId = null
  
  // Buscar en todas las categorías de nivel 1
  for (const cat1 of allCategories.value) {
    if (cat1.children) {
      const foundLevel2 = cat1.children.find(c => c.id === level2ParentId)
      if (foundLevel2) {
        level2Category = foundLevel2
        level1ParentId = cat1.id
        break
      }
    }
  }
  
  if (!level2Category || !level1ParentId) return ''
  
  // Encontrar la categoría de nivel 1
  const level1Category = allCategories.value.find(c => c.id === level1ParentId)
  
  if (!level1Category) return ''
  
  return `${level1Category.name} > ${level2Category.name} > ${level3Category.name}`
}

// Eliminar una categoría inicial
const removeInitialCategory = (categoryId) => {
  initialCategories.value = initialCategories.value.filter(
    cat => cat.category.id !== categoryId
  )
  updateSelectedCategories()
}

// Manejadores de cambios
const handleLevel1Change = (index) => {
  const selector = categorySelectors.value[index]
  // Restablecer los niveles secundarios
  selector.level2 = null
  selector.level3 = null
  updateSelectedCategories()
}

const handleLevel2Change = (index) => {
  const selector = categorySelectors.value[index]
  // Restablecer nivel 3
  selector.level3 = null
  updateSelectedCategories()
}

const handleLevel3Change = () => {
  updateSelectedCategories()
}

// Agregar otro selector de categoría
const addCategorySelector = () => {
  if (totalSelectedCategories.value < 3) {
    categorySelectors.value.push({ level1: null, level2: null, level3: null })
  }
}

// Eliminar un selector de categoría
const removeCategorySelector = (index) => {
  categorySelectors.value.splice(index, 1)
  if (categorySelectors.value.length === 0) {
    categorySelectors.value.push({ level1: null, level2: null, level3: null })
  }
  updateSelectedCategories()
}

// Eliminar una categoría seleccionada
const removeSelectedCategory = (categoryId) => {
  for (const selector of categorySelectors.value) {
    if (selector.level3 === categoryId) {
      selector.level3 = null
    } else if (selector.level2 === categoryId) {
      selector.level2 = null
      selector.level3 = null
    } else if (selector.level1 === categoryId) {
      selector.level1 = null
      selector.level2 = null
      selector.level3 = null
    }
  }
  
  // Limpiar selectores vacíos excepto uno
  const nonEmptySelectors = categorySelectors.value.filter(selector => selector.level1 !== null)
  if (nonEmptySelectors.length > 0) {
    categorySelectors.value = nonEmptySelectors
  } else if (categorySelectors.value.length > 1) {
    categorySelectors.value = [{ level1: null, level2: null, level3: null }]
  }
  
  updateSelectedCategories()
}

// Cargar categorías desde el API
const loadAllCategories = async () => {
  loadingCategories.value = true
  try {
    // Cargar categorías de nivel 1 con sus hijos de nivel 2
    const { data: level1Data, error: level1Error } = await filterCategories({ level: 1 })
    if (!level1Error && level1Data) {
      allCategories.value = level1Data
      
      // Cargar categorías de nivel 2 con sus hijos de nivel 3
      const { data: level2Data, error: level2Error } = await filterCategories({ level: 2 })
      if (!level2Error && level2Data) {
        level2WithChildren.value = level2Data
      }
    }
  } catch (error) {
    console.error('Error al cargar categorías:', error)
  } finally {
    loadingCategories.value = false
  }
}

// Emitir categorías iniciales
const emitInitialCategories = () => {
  if (initialCategories.value.length > 0) {
    emit('update:categories', initialCategories.value.map(cat => cat.category.id))
  }
}

// Inicializar el componente
onMounted(async () => {
  await loadAllCategories()
  emitInitialCategories()
})
</script> 