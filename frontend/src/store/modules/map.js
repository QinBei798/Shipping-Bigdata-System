import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const vessels = ref([])
  const routes = ref([])

  function setVessels(data) {
    // 自动为每艘船记录并更新最近 5 次的航行轨迹点 (Track Tails)
    const oldVesselsMap = new Map(vessels.value.map(v => [v.mmsi, v]))
    
    vessels.value = data.map(newV => {
      const oldV = oldVesselsMap.get(newV.mmsi)
      const currentPos = [newV.longitude, newV.latitude]
      
      let history = []
      if (oldV && oldV.history) {
        history = [...oldV.history]
        const lastPos = history[history.length - 1]
        // 只有坐标发生实际变化时才记录新历史点，防重复记录
        if (!lastPos || lastPos[0] !== currentPos[0] || lastPos[1] !== currentPos[1]) {
          history.push(currentPos)
        }
      } else {
        history = [currentPos]
      }
      
      // 保留最近 5 个点
      if (history.length > 5) {
        history.shift()
      }
      
      return {
        ...newV,
        history
      }
    })
  }

  function setRoutes(data) {
    routes.value = data
  }

  function addVessel(vessel) {
    const currentPos = [vessel.longitude, vessel.latitude]
    vessels.value.push({
      ...vessel,
      history: [currentPos]
    })
  }

  function updateVesselPosition(mmsi, patch) {
    const target = vessels.value.find(v => v.mmsi === mmsi)
    if (target) {
      Object.assign(target, patch)
      if (patch.longitude !== undefined || patch.latitude !== undefined) {
        const currentPos = [target.longitude, target.latitude]
        if (!target.history) {
          target.history = [currentPos]
        } else {
          const lastPos = target.history[target.history.length - 1]
          if (!lastPos || lastPos[0] !== currentPos[0] || lastPos[1] !== currentPos[1]) {
            target.history.push(currentPos)
            if (target.history.length > 5) {
              target.history.shift()
            }
          }
        }
      }
    }
  }

  return { vessels, routes, setVessels, setRoutes, addVessel, updateVesselPosition }
})
