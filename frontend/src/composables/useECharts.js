import { shallowRef, watch, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

export function useECharts(chartRef) {
  const chartInstance = shallowRef(null)

  function initChart() {
    if (!chartRef.value) return
    chartInstance.value = echarts.init(chartRef.value)
  }

  function setOption(options) {
    if (!chartInstance.value) initChart()
    chartInstance.value?.setOption(options, { notMerge: true })
  }

  function updateData(seriesData) {
    chartInstance.value?.setOption({
      series: seriesData.map((data, i) => ({ data }))
    })
  }

  const resizeObserver = new ResizeObserver(() => {
    chartInstance.value?.resize()
  })

  watch(chartRef, (el) => {
    if (el) {
      initChart()
      resizeObserver.observe(el)
    }
  }, { immediate: true })

  onBeforeUnmount(() => {
    resizeObserver.disconnect()
    chartInstance.value?.dispose()
  })

  return { chartInstance, initChart, setOption, updateData }
}
