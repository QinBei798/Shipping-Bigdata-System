import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMarketStore = defineStore('market', () => {
  const ports = ref([])
  const indices = ref([])

  function setPorts(data) {
    ports.value = data
  }

  function setIndices(data) {
    indices.value = data
  }

  return { ports, indices, setPorts, setIndices }
})
