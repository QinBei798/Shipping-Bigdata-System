import { shallowRef, watch, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

/**
 * ECharts 组合式函数 — 解决容器塌陷 (clientWidth/Height = 0) 的核心防御
 *
 * 策略：
 * 1. 延迟 init：只有当 DOM 元素拥有真实宽高时才执行 echarts.init()
 * 2. ResizeObserver 兜底：如果容器从 0 尺寸变为有效尺寸，自动触发 init + resize
 * 3. setOption 防御：调用前检查实例是否就绪，未就绪时缓存 options 等容器就绪后回放
 */
export function useECharts(chartRef) {
  const chartInstance = shallowRef(null)
  let pendingOptions = null

  /** 检查 DOM 元素是否拥有可用的渲染尺寸 */
  function hasDimensions(el) {
    return el && el.clientWidth > 0 && el.clientHeight > 0
  }

  /** 安全初始化 ECharts 实例 */
  function initChart() {
    const el = chartRef.value
    if (!el || !hasDimensions(el)) {
      console.debug('[useECharts] ⏳ 容器尺寸为 0，跳过 init，等待 ResizeObserver 触发')
      return false
    }
    if (chartInstance.value) return true // 已初始化
    console.debug(`[useECharts] ✅ 初始化 ECharts (${el.clientWidth}x${el.clientHeight})`)
    chartInstance.value = echarts.init(el)
    // 回放缓存的 options
    if (pendingOptions) {
      chartInstance.value.setOption(pendingOptions, { notMerge: true })
      pendingOptions = null
    }
    return true
  }

  /** 设置图表配置 — 带安全防御 */
  function setOption(options) {
    if (!options || Object.keys(options).length === 0) return
    if (chartInstance.value) {
      chartInstance.value.setOption(options, { notMerge: true })
    } else {
      // 缓存，等容器就绪后回放
      pendingOptions = options
      // 尝试立即初始化
      initChart()
    }
  }

  /** 更新 series 数据 */
  function updateData(seriesData) {
    chartInstance.value?.setOption({
      series: seriesData.map((data, i) => ({ data }))
    })
  }

  // ── ResizeObserver：核心防塌陷机制 ──
  let resizeObserver = null

  function setupObserver(el) {
    if (!el) return
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          if (!chartInstance.value) {
            // 容器从 0 → 有效尺寸，触发延迟初始化
            initChart()
          } else {
            chartInstance.value.resize()
          }
        }
      }
    })
    resizeObserver.observe(el)
  }

  // ── 监听 chartRef 挂载 ──
  watch(chartRef, async (el) => {
    if (el) {
      await nextTick()
      setupObserver(el)
      initChart() // 尝试立即初始化（如果此刻已有尺寸）
    }
  }, { immediate: true })

  // ── 清理 ──
  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
    chartInstance.value?.dispose()
    chartInstance.value = null
    pendingOptions = null
  })

  return { chartInstance, initChart, setOption, updateData }
}
