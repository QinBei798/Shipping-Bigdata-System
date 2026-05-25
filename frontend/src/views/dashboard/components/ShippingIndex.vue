<template>
  <div class="shipping-index-chart">
    <LineChart :options="chartOptions" v-if="chartOptions" />
    <div v-else class="flex items-center justify-center h-full" style="color: var(--color-text-secondary);">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'
import LineChart from '@/components/charts/LineChart.vue'

const marketStore = useMarketStore()
const { indices } = storeToRefs(marketStore)

const lineColors = { BDI: '#0ff', BCI: '#1e90ff', BPI: '#0a8', BSI: '#ffa500' }

const chartOptions = computed(() => {
  if (!indices.value?.timeline?.length) return null
  const timeline = indices.value.timeline
  const dates = timeline.map(t => t.date)
  const keys = ['bdi', 'bci', 'bpi', 'bsi']
  const labels = ['BDI', 'BCI', 'BPI', 'BSI']
  return {
    xAxis: { type: 'category', data: dates, axisLabel: { color: '#7eb8ff', fontSize: 10 } },
    yAxis: { type: 'value', axisLabel: { color: '#7eb8ff', fontSize: 10 } },
    series: keys.map((key, i) => ({
      name: labels[i],
      type: 'line',
      data: timeline.map(t => t[key]),
      smooth: true,
      lineStyle: { color: lineColors[labels[i]], width: 2 },
      itemStyle: { color: lineColors[labels[i]] },
      symbol: 'circle',
      symbolSize: 4
    }))
  }
})
</script>

<style scoped>
.shipping-index-chart { width: 100%; height: 100%; }
</style>
