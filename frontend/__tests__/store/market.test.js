import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMarketStore } from '@/store/modules/market.js'

describe('market store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty ports and indices', () => {
    const store = useMarketStore()
    expect(store.ports).toEqual([])
    expect(store.indices).toEqual([])
  })

  it('setPorts assigns port list', () => {
    const store = useMarketStore()
    const ports = [{ rank: 1, portName: 'Test', throughput: 10 }]
    store.setPorts(ports)
    expect(store.ports).toEqual(ports)
  })

  it('setIndices assigns timeline array', () => {
    const store = useMarketStore()
    const indices = [{ date: '2026-05-25', bdi: 1834 }]
    store.setIndices(indices)
    expect(store.indices).toEqual(indices)
  })
})
