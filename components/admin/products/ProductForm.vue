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
          class="mt-2"
        />
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

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      price: 0,
      stock: 0,
      active: true
    })
  },
  hideCancelButton: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    default: 'Continuar'
  }
})

const emit = defineEmits(['cancel', 'continue'])

const productData = ref({
  title: props.initialData.title,
  description: props.initialData.description,
  price: props.initialData.price,
  stock: props.initialData.stock,
  active: props.initialData.active
})

const isFormValid = computed(() => {
  return productData.value.title && 
         productData.value.description && 
         productData.value.price > 0 && 
         productData.value.stock >= 0
})

const continuar = () => {
  if (isFormValid.value) {
    emit('continue', productData.value)
  }
}
</script> 