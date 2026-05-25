<template>
  <aside class="flex flex-col gap-4 p-4 h-full">
    <div class="panel-card flex-1">
      <h3 class="panel-title">全球港口吞吐量 Top10</h3>
      <div class="chart-wrapper">
        <BarChart :options="chartOptions" v-if="chartOptions" />
        <div v-else class="flex items-center justify-center h-full" style="color: var(--color-text-secondary);">
          Loading...
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'
import { fetchPorts } from '@/api/shipping.js'
import BarChart from '@/components/charts/BarChart.vue'

const marketStore = useMarketStore()
const { ports } = storeToRefs(marketStore)

const chartOptions = computed(() => {
  if (!ports.value.length) return null
  const names = ports.value.map(p => p.portName).reverse()
  const values = ports.value.map(p => p.throughput).reverse()
  return {
    xAxis: { type: 'value', axisLabel: { color: '#7eb8ff', fontSize: 10 } },
    yAxis: { type: 'category', data: names, axisLabel: { color: '#7eb8ff', fontSize: 10 }, inverse: true },
    series: [{
      type: 'bar',
      data: values,
      itemStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: '#0a8' }, { offset: 1, color: '#0ff' }]
        }
      },
      barMaxWidth: 20
    }]
  }
})

onMounted(async () => {
  try {
    const data = await fetchPorts()
    marketStore.setPorts(data.list)
  } catch (e) { console.error('Failed to load ports:', e) }
})
</script>

<style scoped>
.panel-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-panel);
  border-radius: 4px;
  padding: 12px;
}
.panel-title {
  color: var(--color-accent-cyan);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid var(--color-accent-cyan);
}
.chart-wrapper { flex: 1; min-height: 0; }
</style>
