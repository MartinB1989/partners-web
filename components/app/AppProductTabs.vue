<template>
  <v-card flat>
    <v-tabs
      v-model="activeTab"
      color="primary"
      align-tabs="center"
      grow
    >
      <v-tab 
        v-for="(tab, index) in tabs"
        :key="index"
        :value="tab.value"
      >
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    
    <v-card-text class="mt-4">
      <v-window v-model="activeTab">
        <v-window-item
          v-for="(tab, index) in tabs"
          :key="index"
          :value="tab.value"
        >
          <slot :name="`content-${tab.value}`">
            <div v-if="tab.value === 'description' && description" class="text-body-1">
              <div class="product-description">{{ description }}</div>
            </div>
            <div v-else class="text-center text-body-2 text-grey">
              No hay información disponible
            </div>
          </slot>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Tab {
  label: string;
  value: string;
}

interface Props {
  tabs: Tab[];
  description?: string;
  initialTab?: string;
}

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [{ label: 'Descripción', value: 'description' }],
  description: '',
  initialTab: 'description'
});

const activeTab = ref(props.initialTab);
</script>

<style scoped>
.product-description {
  white-space: pre-line;
}
</style> 