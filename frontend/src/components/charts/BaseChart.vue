<template>
  <div ref="chartRef" class="w-full h-full"></div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useECharts } from '@/composables/useECharts.js'

const props = defineProps({
  options: { type: Object, required: true }
})

const chartRef = ref(null)
const { setOption } = useECharts(chartRef)

onMounted(async () => {
  await nextTick()
  if (props.options && Object.keys(props.options).length > 0) {
    setOption(props.options)
  }
})

watch(() => props.options, (opts) => {
  if (opts && Object.keys(opts).length > 0) {
    setOption(opts)
  }
}, { deep: true })

defineExpose({ setOption })
</script>
