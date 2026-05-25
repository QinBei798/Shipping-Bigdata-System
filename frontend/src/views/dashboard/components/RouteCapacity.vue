<template>
  <div class="route-capacity-chart">
    <BarChart :options="chartOptions" v-if="chartOptions" />
    <div v-else class="loading-placeholder">
      <span>数据加载中...</span>
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
  if (!routes.value || !routes.value.length) return null
  const names = routes.value.map(r => r.routeName)
  const values = routes.value.map(r => r.capacityTEU)
  return {
    xAxis: {
      type: 'value',
      axisLabel: {
        color: '#7eb8ff',
        fontSize: 10,
        formatter: (val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val
      },
      splitLine: { lineStyle: { color: 'rgba(126, 184, 255, 0.1)' } }
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLabel: { color: '#7eb8ff', fontSize: 10 },
      inverse: true
    },
    series: [{
      type: 'bar',
      data: values,
      itemStyle: {
        color: {
          type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#1e90ff' },
            { offset: 1, color: '#0ff' }
          ]
        }
      },
      barMaxWidth: 20,
      label: {
        show: true,
        position: 'right',
        color: '#7eb8ff',
        fontSize: 10,
        formatter: (params) => {
          const val = params.value
          return val >= 1000000 ? `${(val / 1000000).toFixed(1)}M TEU` : val
        }
      }
    }]
  }
})
</script>

<style scoped>
.route-capacity-chart {
  width: 100%;
  height: 100%;
  min-height: 120px;
}

.loading-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary, #5a7aa0);
  font-size: 13px;
}
</style>
