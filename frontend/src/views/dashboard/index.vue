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
          <div class="title-container">
            <h3 class="panel-title">航运市场指数 BDI 走势</h3>
            <span class="data-source-badge">数据来源: 2025年真实统计数据</span>
          </div>
          <div class="chart-wrapper">
            <ShippingIndex />
          </div>
        </div>
        <div class="panel-card">
          <div class="title-container">
            <h3 class="panel-title">主要航线运力分布</h3>
            <span class="data-source-badge">数据来源: 2025年真实统计数据</span>
          </div>
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
    console.debug('[Dashboard] ✅ 静态数据加载成功', { ports, indices, routes })
    // ports 返回的是 { year, unit, list } → 取 .list
    marketStore.setPorts(ports.list)
    // indices 返回的是 { indexName, frequency, description, timeline } → 整体存储
    marketStore.setIndices(indices)
    // routes 返回的是 { category, routes } → 取 .routes
    mapStore.setRoutes(routes.routes)
  } catch (e) {
    console.error('[Dashboard] ❌ 静态数据加载失败:', e)
  }
}

async function loadVessels() {
  try {
    const data = await fetchVessels()
    mapStore.setVessels(data.list)
  } catch (e) {
    console.error('[Dashboard] ❌ 船舶数据加载失败:', e)
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
  grid-template-columns: 30% 40% 30%;
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

/* ── 关键修复：panel-card 必须是 flex column 容器，高度才能向下传递 ── */
.panel-card {
  background: var(--color-bg-panel);
  border: 1px solid var(--color-border-panel);
  border-radius: 4px;
  padding: 12px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.panel-title {
  color: var(--color-accent-cyan);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 0;
  padding-left: 8px;
  border-left: 3px solid var(--color-accent-cyan);
  flex-shrink: 0;
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.data-source-badge {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* ── 关键修复：chart-wrapper 必须有 flex:1 + min-height 才能让 ECharts 获得真实像素高度 ── */
.chart-wrapper {
  flex: 1;
  min-height: 120px;
  position: relative;
}
</style>
