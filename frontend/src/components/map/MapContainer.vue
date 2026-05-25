<template>
  <div ref="chartRef" class="map-container"></div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import * as echarts from 'echarts'
import { useMapStore } from '@/store/modules/map.js'
import { useECharts } from '@/composables/useECharts.js'

const mapStore = useMapStore()
const { vessels, routes } = storeToRefs(mapStore)

const chartRef = ref(null)
const { setOption } = useECharts(chartRef)
const geoRegistered = ref(false)

const vesselScatterData = computed(() =>
  vessels.value.map(v => ({
    name: v.vesselName,
    value: [v.longitude, v.latitude, v.speed, v.heading]
  }))
)

const routeLinesData = computed(() =>
  routes.value.map(r => ({
    coords: r.coords,
    lineStyle: { width: Math.max(1, (r.vesselDensityValue || 50) / 25) }
  }))
)

const chartOptions = computed(() => {
  if (!geoRegistered.value) return null
  return {
    geo: {
      map: 'world',
      roam: true,
      itemStyle: { areaColor: '#0a1628', borderColor: 'rgba(0,150,255,0.3)' }
    },
    series: [
      {
        type: 'lines',
        coordinateSystem: 'geo',
        data: routeLinesData.value,
        lineStyle: { color: '#0ff', width: 1 },
        effect: { show: true, period: 6, trailLength: 0.3, symbolSize: 6 }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: vesselScatterData.value,
        symbolSize: 8,
        rippleEffect: { brushType: 'stroke' },
        itemStyle: { color: '#0ff' }
      }
    ]
  }
})

onMounted(async () => {
  try {
    const res = await fetch('/data/world.json')
    if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`)
    const geoJSON = await res.json()
    echarts.registerMap('world', geoJSON)
    geoRegistered.value = true
  } catch (e) {
    console.error('[MapContainer] 世界地图加载失败:', e.message)
  }
})

watch(chartOptions, (opts) => {
  if (opts) setOption(opts)
}, { deep: true })
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
