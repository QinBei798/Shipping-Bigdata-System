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
  registerMap: vi.fn(),
  default: { init: vi.fn(() => mockInstance), registerMap: vi.fn() }
}))

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn()
}))

global.fetch = vi.fn(() => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve({ type: 'FeatureCollection', features: [] })
}))

import MapContainer from '@/components/map/MapContainer.vue'
import * as echarts from 'echarts'

describe('MapContainer.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renders a chart container div', () => {
    const wrapper = mount(MapContainer)
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('fetches world.json and registers map on mount', async () => {
    mount(MapContainer)
    await vi.waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/data/world.json')
    }, { timeout: 200 })
    await vi.waitFor(() => {
      expect(echarts.registerMap).toHaveBeenCalledWith('world', expect.any(Object))
    }, { timeout: 200 })
  })

  it('configures effectScatter series from store vessels', async () => {
    const store = useMapStore()
    store.setVessels([
      { mmsi: '001', vesselName: 'Ship A', longitude: 121, latitude: 31, speed: 15, heading: 90 },
      { mmsi: '002', vesselName: 'Ship B', longitude: 139, latitude: 35, speed: 12, heading: 180 }
    ])

    mount(MapContainer)

    await vi.waitFor(() => {
      const calls = mockInstance.setOption.mock.calls
      expect(calls.length).toBeGreaterThan(0)
      const opts = calls[calls.length - 1][0]
      expect(opts.series).toBeDefined()
    }, { timeout: 500 })

    const opts = mockInstance.setOption.mock.calls.at(-1)[0]
    const scatter = opts.series.find(s => s.type === 'effectScatter')
    expect(scatter).toBeDefined()
    expect(scatter.data).toHaveLength(2)
    expect(scatter.data[0].value).toEqual([121, 31, 15, 90])
    expect(scatter.data[1].value).toEqual([139, 35, 12, 180])
  })

  it('configures lines series from store routes', async () => {
    const store = useMapStore()
    store.setRoutes([
      { id: 'R01', routeName: 'Route A', coords: [[121, 31], [139, 35]], vesselDensityValue: 80, activeVessels: 100, capacityTEU: 1000000 },
    ])

    mount(MapContainer)

    await vi.waitFor(() => {
      const calls = mockInstance.setOption.mock.calls
      expect(calls.length).toBeGreaterThan(0)
      const opts = calls[calls.length - 1][0]
      expect(opts.series).toBeDefined()
    }, { timeout: 500 })

    const opts = mockInstance.setOption.mock.calls.at(-1)[0]
    const lines = opts.series.find(s => s.type === 'lines')
    expect(lines).toBeDefined()
    expect(lines.data).toHaveLength(1)
    expect(lines.data[0].coords).toEqual([[121, 31], [139, 35]])
  })

  it('configures geo with world map and roam', async () => {
    mount(MapContainer)

    await vi.waitFor(() => {
      expect(mockInstance.setOption).toHaveBeenCalled()
    }, { timeout: 500 })

    const opts = mockInstance.setOption.mock.calls.at(-1)[0]
    expect(opts.geo).toBeDefined()
    expect(opts.geo.map).toBe('world')
    expect(opts.geo.roam).toBe(true)
  })
})
