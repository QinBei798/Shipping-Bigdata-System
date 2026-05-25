import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderTitle from '@/views/dashboard/components/HeaderTitle.vue'

describe('HeaderTitle.vue', () => {
  describe('rendering', () => {
    it('renders the dashboard title', () => {
      const wrapper = mount(HeaderTitle)
      expect(wrapper.text()).toContain('航运大数据可视化平台')
    })

    it('renders the online status indicator', () => {
      const wrapper = mount(HeaderTitle)
      expect(wrapper.text()).toContain('数据更新中')
    })
  })

  describe('real-time clock', () => {
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval'] })
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('calls setInterval with 1000ms on mount', () => {
      const spy = vi.spyOn(window, 'setInterval')
      mount(HeaderTitle)
      expect(spy).toHaveBeenCalledWith(expect.any(Function), 1000)
      spy.mockRestore()
    })

    it('clears the interval on unmount', () => {
      const clearSpy = vi.spyOn(window, 'clearInterval')
      const wrapper = mount(HeaderTitle)
      wrapper.unmount()
      expect(clearSpy).toHaveBeenCalled()
      clearSpy.mockRestore()
    })
  })
})
