import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'

// Mock API
vi.mock('@/api/shipping.js', () => ({
  fetchPorts: vi.fn(() => Promise.resolve({
    year: 2025,
    unit: 'Million TEU',
    list: [
      { rank: 1, portName: '上海港', englishName: 'Port of Shanghai', country: 'China', throughput: 49.20, growthRate: 4.1 },
      { rank: 2, portName: '新加坡港', englishName: 'Port of Singapore', country: 'Singapore', throughput: 39.01, growthRate: 4.6 },
      { rank: 3, portName: '宁波舟山港', englishName: 'Ningbo-Zhoushan Port', country: 'China', throughput: 35.30, growthRate: 5.8 }
    ]
  }))
}))

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({ setOption: vi.fn(), dispose: vi.fn(), resize: vi.fn() })),
  default: { init: vi.fn(() => ({ setOption: vi.fn(), dispose: vi.fn(), resize: vi.fn() })) }
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn()
}))

import LeftPanel from '@/views/dashboard/components/LeftPanel.vue'
import { fetchPorts } from '@/api/shipping.js'

describe('LeftPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders the panel title', () => {
    const wrapper = mount(LeftPanel)
    expect(wrapper.text()).toContain('全球港口吞吐量')
  })

  it('initializes with empty ports from store', () => {
    const store = useMarketStore()
    const wrapper = mount(LeftPanel)
    expect(store.ports).toEqual([])
  })

  it('calls fetchPorts API on mount', () => {
    mount(LeftPanel)
    expect(fetchPorts).toHaveBeenCalled()
  })

  it('populates store with port data after API call', async () => {
    const store = useMarketStore()
    mount(LeftPanel)
    // Wait for the async onMounted to complete
    await vi.waitFor(() => {
      expect(store.ports).toHaveLength(3)
    }, { timeout: 100 })
    expect(store.ports[0].portName).toBe('上海港')
  })
})
