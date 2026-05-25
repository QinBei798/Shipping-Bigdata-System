<template>
  <aside class="left-panel">
    <div class="panel-card">
      <h3 class="panel-title">全球港口吞吐量 Top10</h3>
      <div class="chart-wrapper">
        <BarChart :options="chartOptions" v-if="chartOptions" />
        <div v-else class="loading-placeholder">
          <span>数据加载中...</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'
import BarChart from '@/components/charts/BarChart.vue'

// 数据由父组件 dashboard/index.vue 统一加载到 Pinia Store
// 这里只负责响应式读取，不重复发起请求
const marketStore = useMarketStore()
const { ports } = storeToRefs(marketStore)

const chartOptions = computed(() => {
  if (!ports.value || !ports.value.length) return null
  const names = ports.value.map(p => p.portName)
  const values = ports.value.map(p => p.throughput)
  return {
    xAxis: {
      type: 'value',
      axisLabel: { color: '#7eb8ff', fontSize: 10 },
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
            { offset: 0, color: '#0a8' },
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
        formatter: '{c}'
      }
    }]
  }
})
</script>

<style scoped>
.left-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
}

.panel-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-panel);
  border-radius: 4px;
  padding: 12px;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel-title {
  color: var(--color-accent-cyan);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid var(--color-accent-cyan);
  flex-shrink: 0;
}

.chart-wrapper {
  flex: 1;
  min-height: 120px;
  position: relative;
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
