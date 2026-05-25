<template>
  <BaseChart :options="mergedOptions" />
</template>

<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  options: { type: Object, default: () => ({}) }
})

const mergedOptions = computed(() => ({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  ...props.options
}))
</script>
