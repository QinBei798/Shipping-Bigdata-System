<template>
  <div ref="chartRef" class="base-chart-container"></div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useECharts } from '@/composables/useECharts.js'

const props = defineProps({
  options: { type: Object, default: () => ({}) }
})

const chartRef = ref(null)
const { setOption } = useECharts(chartRef)

// 深度监听 options 变化 — 数据从 Pinia Store 异步抵达时自动触发
watch(() => props.options, async (opts) => {
  if (opts && Object.keys(opts).length > 0) {
    await nextTick() // 确保模板因 v-if 切换完成 DOM 更新
    setOption(opts)
  }
}, { deep: true, immediate: true })

defineExpose({ setOption })
</script>

<style scoped>
.base-chart-container {
  width: 100%;
  height: 100%;
  min-height: 120px; /* 防塌陷安全底线 */
}
</style>
