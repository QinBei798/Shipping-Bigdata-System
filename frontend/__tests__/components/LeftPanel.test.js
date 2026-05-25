import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'

// Mock echarts
vi.mock('echarts', () => ({
  init: vi.fn(() => ({ setOption: vi.fn(), dispose: vi.fn(), resize: vi.fn() })),
  default: { init: vi.fn(() => ({ setOption: vi.fn(), dispose: vi.fn(), resize: vi.fn() })) }
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn()
}))

import LeftPanel from '@/views/dashboard/components/LeftPanel.vue'

describe('LeftPanel.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders the panel title and loading placeholder', () => {
    const wrapper = mount(LeftPanel)
    expect(wrapper.text()).toContain('全球港口吞吐量')
    expect(wrapper.text()).toContain('数据加载中')
  })

  it('initializes with empty ports from store', () => {
    const store = useMarketStore()
    mount(LeftPanel)
    expect(store.ports).toEqual([])
  })

  it('renders BarChart when store has port data', async () => {
    const store = useMarketStore()
    store.setPorts([
      { rank: 1, portName: '上海港', englishName: 'Port of Shanghai', country: 'China', throughput: 49.20, growthRate: 4.1 },
      { rank: 2, portName: '新加坡港', englishName: 'Port of Singapore', country: 'Singapore', throughput: 39.01, growthRate: 4.6 },
      { rank: 3, portName: '宁波舟山港', englishName: 'Ningbo-Zhoushan Port', country: 'China', throughput: 35.30, growthRate: 5.8 }
    ])
    const wrapper = mount(LeftPanel)
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).not.toContain('数据加载中')
  })
})
