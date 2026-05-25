import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const vessels = ref([])
  const routes = ref([])

  function setVessels(data) {
    vessels.value = data
  }

  function setRoutes(data) {
    routes.value = data
  }

  function addVessel(vessel) {
    vessels.value.push(vessel)
  }

  function updateVesselPosition(mmsi, patch) {
    const target = vessels.value.find(v => v.mmsi === mmsi)
    if (target) {
      Object.assign(target, patch)
    }
  }

  return { vessels, routes, setVessels, setRoutes, addVessel, updateVesselPosition }
})
