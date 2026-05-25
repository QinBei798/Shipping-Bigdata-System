import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'

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
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

import BaseChart from '@/components/charts/BaseChart.vue'
import * as echarts from 'echarts'

describe('BaseChart.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a chart container div', () => {
    const wrapper = mount(BaseChart, {
      props: { options: {} }
    })
    expect(wrapper.find('div').exists()).toBe(true)
  })

  it('exposes setOption method', () => {
    const wrapper = mount(BaseChart, {
      props: { options: {} }
    })
    expect(typeof wrapper.vm.setOption).toBe('function')
  })

  it('initializes ECharts instance on mount', async () => {
    mount(BaseChart, {
      props: { options: { xAxis: {}, yAxis: {}, series: [] } }
    })
    // Wait for onMounted + nextTick to process
    await vi.waitFor(() => {
      expect(echarts.init).toHaveBeenCalled()
    }, { timeout: 100 })
  })

  it('disposes ECharts instance on unmount', async () => {
    const wrapper = mount(BaseChart, {
      props: { options: { xAxis: {}, yAxis: {}, series: [] } }
    })
    await vi.waitFor(() => {
      expect(echarts.init).toHaveBeenCalled()
    }, { timeout: 100 })
    wrapper.unmount()
    expect(mockInstance.dispose).toHaveBeenCalled()
  })
})
