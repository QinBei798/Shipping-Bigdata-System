<template>
  <div class="route-capacity-chart">
    <BarChart :options="chartOptions" v-if="chartOptions" />
    <div v-else class="flex items-center justify-center h-full" style="color: var(--color-text-secondary);">
      Loading...
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMapStore } from '@/store/modules/map.js'
import BarChart from '@/components/charts/BarChart.vue'

const mapStore = useMapStore()
const { routes } = storeToRefs(mapStore)

const chartOptions = computed(() => {
  if (!routes.value.length) return null
  const names = routes.value.map(r => r.routeName).reverse()
  const values = routes.value.map(r => r.capacityTEU).reverse()
  return {
    xAxis: { type: 'value', axisLabel: { color: '#7eb8ff', fontSize: 10 } },
    yAxis: { type: 'category', data: names, axisLabel: { color: '#7eb8ff', fontSize: 10 }, inverse: true },
    series: [{
      type: 'bar',
      data: values,
      itemStyle: {
        color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [{ offset: 0, color: '#1e90ff' }, { offset: 1, color: '#0ff' }]
        }
      },
      barMaxWidth: 20
    }]
  }
})
</script>

<style scoped>
.route-capacity-chart { width: 100%; height: 100%; }
</style>
