import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { useMapStore } from '@/store/modules/map.js'

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

import RouteCapacity from '@/views/dashboard/components/RouteCapacity.vue'

describe('RouteCapacity.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders a chart component', () => {
    const wrapper = mount(RouteCapacity)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('configures bar chart with route capacity data', async () => {
    const store = useMapStore()
    store.setRoutes([
      { id: 'R01', routeName: '远东-西欧航线', coords: [[121, 31], [4, 51]], capacityTEU: 4850000, vesselDensityValue: 94, activeVessels: 412 },
      { id: 'R02', routeName: '美西航线', coords: [[121, 31], [-122, 37]], capacityTEU: 3200000, vesselDensityValue: 88, activeVessels: 285 },
      { id: 'R03', routeName: '远东-非洲航线', coords: [[103, 1], [18, -33]], capacityTEU: 1950000, vesselDensityValue: 65, activeVessels: 184 }
    ])

    mount(RouteCapacity)

    await vi.waitFor(() => {
      expect(mockInstance.setOption).toHaveBeenCalled()
    }, { timeout: 500 })

    const opts = mockInstance.setOption.mock.calls.at(-1)[0]
    expect(opts.yAxis).toBeDefined()
    expect(opts.yAxis.type).toBe('category')
    expect(opts.yAxis.data).toEqual(['远东-非洲航线', '美西航线', '远东-西欧航线'])
    expect(opts.series).toBeDefined()
    expect(opts.series[0].type).toBe('bar')
    expect(opts.series[0].data).toEqual([1950000, 3200000, 4850000])
  })

  it('shows empty chart when no routes in store', () => {
    const wrapper = mount(RouteCapacity)
    expect(wrapper.find('div').exists()).toBe(true)
  })
})
