import { config } from '@vue/test-utils'

config.global.stubs = { transition: false }

// jsdom polyfill: ECharts 容器尺寸防御需要真实的 clientWidth/clientHeight
// jsdom 默认返回 0，导致 useECharts 的 hasDimensions() 永远为 false
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() {
    return parseFloat(this.style.width) || 800
  }
})
Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  get() {
    return parseFloat(this.style.height) || 600
  }
})
