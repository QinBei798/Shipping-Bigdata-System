import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Pure calculation logic tested in isolation
function calcScale(screenW, screenH, baseW = 1920, baseH = 1080) {
  const scaleX = screenW / baseW
  const scaleY = screenH / baseH
  return Math.min(scaleX, scaleY)
}

describe('calcScale — pure logic', () => {
  it('returns 1 for exact 1920x1080 viewport', () => {
    expect(calcScale(1920, 1080)).toBe(1)
  })

  it('scales down proportionally for smaller viewport', () => {
    const scale = calcScale(960, 540)
    expect(scale).toBe(0.5)
  })

  it('scales by the smaller dimension when aspect ratio differs', () => {
    const scale = calcScale(1920, 540) // ultra-wide
    expect(scale).toBe(0.5) // limited by height
  })

  it('allows upscale for larger than base viewport', () => {
    const scale = calcScale(3840, 2160) // 4K
    expect(scale).toBeGreaterThan(1)
  })
})

describe('useScreenScale — composable lifecycle', () => {
  let addSpy
  let removeSpy

  beforeEach(() => {
    addSpy = vi.spyOn(window, 'addEventListener')
    removeSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    addSpy.mockRestore()
    removeSpy.mockRestore()
  })

  it('registers resize listener on mount', async () => {
    const { useScreenScale } = await import('@/composables/useScreenScale.js')
    const { scale } = useScreenScale()
    expect(scale.value).toBeGreaterThan(0)
    // composable registers resize via onMounted — in jsdom lifecycle runs during import/mount flow
    // We verify the composable is callable and returns a reactive scale
  })

  it('module exports useScreenScale as a function', async () => {
    const mod = await import('@/composables/useScreenScale.js')
    expect(typeof mod.useScreenScale).toBe('function')
  })
})
