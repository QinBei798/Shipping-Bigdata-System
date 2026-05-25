<template>
  <div class="shipping-index-chart">
    <LineChart :options="chartOptions" v-if="chartOptions" />
    <div v-else class="loading-placeholder">
      <span>数据加载中...</span>
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

const lineColors = {
  BDI: '#FFFFFF',  // Main BDI: Pure white highlight
  BCI: '#4B5E80',  // BCI: Muted dark slate blue
  BPI: '#5B6F96',  // BPI: Muted slate gray-blue
  BSI: '#6C7FAD'   // BSI: Muted pale purple-gray
}

const chartOptions = computed(() => {
  // 关键防御：indices 是整个对象，内含 .timeline 数组
  if (!indices.value || !indices.value.timeline || !indices.value.timeline.length) return null
  const timeline = indices.value.timeline
  const dates = timeline.map(t => t.date)
  const keys = ['bdi', 'bci', 'bpi', 'bsi']
  const labels = ['BDI', 'BCI', 'BPI', 'BSI']
  return {
    legend: {
      data: labels,
      textStyle: { color: '#7eb8ff', fontSize: 10 },
      top: 0,
      right: 0
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: { color: '#7eb8ff', fontSize: 10 },
      splitLine: { show: false } // 隐藏 X 轴网格线
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#7eb8ff', fontSize: 10 },
      splitLine: { show: false } // 隐藏 Y 轴网格线
    },
    series: keys.map((key, i) => {
      const label = labels[i]
      const isBDI = label === 'BDI'
      const baseSeries = {
        name: label,
        type: 'line',
        data: timeline.map(t => t[key]),
        smooth: true,
        lineStyle: { color: lineColors[label], width: isBDI ? 2.5 : 1.2 }, // 👈 辅助分项指标折线：线宽变细 (1.2)
        itemStyle: { color: lineColors[label] },
        symbol: 'circle',
        symbolSize: isBDI ? 5 : 3
      }

      if (isBDI) {
        baseSeries.areaStyle = {
          color: {
            type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 255, 255, 0.06)' },
              { offset: 1, color: 'rgba(255, 255, 255, 0)' }
            ]
          }
        }
      }
      return baseSeries
    })
  }
})
</script>

<style scoped>
.shipping-index-chart {
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
