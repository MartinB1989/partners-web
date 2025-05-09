<template>
  <div class="d-flex justify-center">
    <v-card class="pa-4 mb-4 w-100" max-width="1200">
      <v-card-text>
        <v-text-field
          v-model="productData.title"
          label="Título"
          required
          variant="outlined"
          class="mb-4"
          :rules="[v => !!v || 'El título es requerido']"
        />
        
        <v-textarea
          v-model="productData.description"
          label="Descripción"
          rows="4"
          required
          variant="outlined"
          class="mb-4"
          :rules="[v => !!v || 'La descripción es requerida']"
        />
        
        <v-text-field
          v-model.number="productData.price"
          label="Precio"
          type="number"
          min="0"
          step="0.01"
          prefix="$"
          required
          variant="outlined"
          class="mb-4"
          :rules="[v => !!v || 'El precio es requerido']"
        />
        
        <v-text-field
          v-model.number="productData.stock"
          label="Stock"
          type="number"
          min="0"
          required
          variant="outlined"
          class="mb-4"
          :rules="[v => !!v || 'El stock es requerido']"
        />
        
        <v-switch
          v-model="productData.active"
          label="Producto activo"
          color="success"
          class="mt-2 mb-4"
        />
        
        <!-- Selector de categorías -->
        <v-divider class="mb-4"/>
        
        <!-- Selector para edición -->
        <CategorySelectorToEdit 
          v-if="isEditMode"
          :initial-product-categories="initialData.productCategories || []"
          @update:categories="handleCategoriesChange"
        />
        
        <!-- Selector para creación -->
        <CategorySelector 
          v-else
          @update:categories="handleCategoriesChange" 
        />
        
        <div v-if="!productData.categoryIds.length" class="text-caption text-error mt-2">
          Debes seleccionar al menos una categoría principal para el producto
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer/>
        <v-btn
          v-if="!hideCancelButton"
          color="error"
          variant="text"
          @click="$emit('cancel')"
        >
          Cancelar
        </v-btn>
        
        <v-btn
          color="primary"
          :disabled="!isFormValid"
          @click="continuar"
        >
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import CategorySelector from './CategorySelector.vue'
import CategorySelectorToEdit from './CategorySelectorToEdit.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      price: 0,
      stock: 0,
      active: true,
      categoryIds: [],
      productCategories: []
    })
  },
  hideCancelButton: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    default: 'Continuar'
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['cancel', 'continue'])

const productData = ref({
  title: props.initialData.title,
  description: props.initialData.description,
  price: props.initialData.price,
  stock: props.initialData.stock,
  active: props.initialData.active,
  categoryIds: props.initialData.categoryIds || []
})

const isFormValid = computed(() => {
  return productData.value.title && 
         productData.value.description && 
         productData.value.price > 0 && 
         productData.value.stock >= 0 &&
         productData.value.categoryIds.length > 0
})

const handleCategoriesChange = (selectedCategories) => {
  productData.value.categoryIds = selectedCategories
}

const continuar = () => {
  if (isFormValid.value) {
    emit('continue', productData.value)
  }
}
</script> 