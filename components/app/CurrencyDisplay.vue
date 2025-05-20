<template>
  <span class="currency-display" :class="classes">{{ formattedValue }}</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useCurrency } from '~/composables/useCurrency';

interface Props {
  amount: number;
  compact?: boolean;
  includeSymbol?: boolean;
  color?: string;
  bold?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  includeSymbol: true,
  color: '',
  bold: false
});

const { formatToCurrency, formatToCompactCurrency } = useCurrency();

const formattedValue = computed(() => {
  if (props.compact) {
    return formatToCompactCurrency(props.amount);
  } else {
    return formatToCurrency(props.amount, {
      includeSymbol: props.includeSymbol
    });
  }
});

const classes = computed(() => {
  const classes = [];
  
  if (props.color) {
    classes.push(`${props.color}--text`);
  }
  
  if (props.bold) {
    classes.push('font-weight-bold');
  }
  
  return classes.join(' ');
});
</script>

<style scoped>
.currency-display {
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}
</style> 