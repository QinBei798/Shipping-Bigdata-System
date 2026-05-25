<template>
  <div class="dashboard" :style="{ transform: `scale(${scale})`, transformOrigin: 'left top' }">
    <header class="dashboard-header">
      <HeaderTitle />
    </header>
    <main class="dashboard-main">
      <section class="dashboard-left">
        <LeftPanel />
      </section>
      <section class="dashboard-center">
        <MapContainer />
      </section>
      <section class="dashboard-right">
        <div class="panel-card">
          <h3 class="panel-title">航运市场指数 BDI 走势</h3>
          <div class="chart-wrapper">
            <ShippingIndex />
          </div>
        </div>
        <div class="panel-card">
          <h3 class="panel-title">主要航线运力分布</h3>
          <div class="chart-wrapper">
            <RouteCapacity />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useMarketStore } from '@/store/modules/market.js'
import { useMapStore } from '@/store/modules/map.js'
import { fetchPorts, fetchIndices, fetchRoutes, fetchVessels } from '@/api/shipping.js'
import { useScreenScale } from '@/composables/useScreenScale.js'
import HeaderTitle from './components/HeaderTitle.vue'
import LeftPanel from './components/LeftPanel.vue'
import MapContainer from '@/components/map/MapContainer.vue'
import ShippingIndex from './components/ShippingIndex.vue'
import RouteCapacity from './components/RouteCapacity.vue'

const marketStore = useMarketStore()
const mapStore = useMapStore()
const { scale } = useScreenScale()

let vesselTimer = null

async function loadStaticData() {
  try {
    const [ports, indices, routes] = await Promise.all([
      fetchPorts(), fetchIndices(), fetchRoutes()
    ])
    marketStore.setPorts(ports.list)
    marketStore.setIndices(indices)
    mapStore.setRoutes(routes.routes)
  } catch (e) {
    console.error('Failed to load static data:', e)
  }
}

async function loadVessels() {
  try {
    const data = await fetchVessels()
    mapStore.setVessels(data.list)
  } catch (e) {
    console.error('Failed to load vessels:', e)
  }
}

onMounted(async () => {
  await loadStaticData()
  await loadVessels()
  vesselTimer = setInterval(loadVessels, 10000)
})

onUnmounted(() => {
  if (vesselTimer) {
    clearInterval(vesselTimer)
    vesselTimer = null
  }
})
</script>

<style scoped>
.dashboard {
  width: 1920px;
  height: 1080px;
  background: var(--color-bg-main, #0a1628);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dashboard-header {
  flex-shrink: 0;
}

.dashboard-main {
  flex: 1;
  display: grid;
  grid-template-columns: 22% 56% 22%;
  gap: 8px;
  padding: 0 8px 8px;
  min-height: 0;
}

.dashboard-left,
.dashboard-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}

.dashboard-center {
  min-height: 0;
}

.panel-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-panel);
  border-radius: 4px;
  padding: 12px;
  flex: 1;
  min-height: 0;
}

.panel-title {
  color: var(--color-accent-cyan);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  padding-left: 8px;
  border-left: 3px solid var(--color-accent-cyan);
}

.chart-wrapper {
  flex: 1;
  min-height: 0;
}
</style>
