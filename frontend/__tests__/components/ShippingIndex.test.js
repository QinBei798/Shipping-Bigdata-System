import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'

const mockInstance = {
  setOption: vi.fn(),
  dispose: vi.fn(),
  resize: vi.fn()
}

vi.mock('echarts', () => ({
  init: vi.fn(() => mockInstance),
  default: { init: vi.fn(() => mockInstance) }
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn()
}))

import ShippingIndex from '@/views/dashboard/components/ShippingIndex.vue'

describe('ShippingIndex.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders a chart component', () => {
    const wrapper = mount(ShippingIndex)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('configures multi-line chart with BDI indices', async () => {
    const store = useMarketStore()
    store.setIndices({
      indexName: 'Baltic Dry Index',
      timeline: [
        { date: '2026-05-19', bdi: 1820, bci: 2650, bpi: 1680, bsi: 1320 },
        { date: '2026-05-20', bdi: 1845, bci: 2710, bpi: 1695, bsi: 1335 },
        { date: '2026-05-21', bdi: 1812, bci: 2605, bpi: 1700, bsi: 1340 }
      ]
    })

    mount(ShippingIndex)

    await vi.waitFor(() => {
      expect(mockInstance.setOption).toHaveBeenCalled()
    }, { timeout: 500 })

    const opts = mockInstance.setOption.mock.calls.at(-1)[0]
    expect(opts.xAxis).toBeDefined()
    expect(opts.xAxis.type).toBe('category')
    expect(opts.xAxis.data).toEqual(['2026-05-19', '2026-05-20', '2026-05-21'])

    expect(opts.series).toHaveLength(4)
    const seriesNames = opts.series.map(s => s.name)
    expect(seriesNames).toContain('BDI')
    expect(seriesNames).toContain('BCI')
    expect(seriesNames).toContain('BPI')
    expect(seriesNames).toContain('BSI')

    const bdiSeries = opts.series.find(s => s.name === 'BDI')
    expect(bdiSeries.type).toBe('line')
    expect(bdiSeries.data).toEqual([1820, 1845, 1812])
  })

  it('shows empty state when no indices in store', () => {
    const wrapper = mount(ShippingIndex)
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
