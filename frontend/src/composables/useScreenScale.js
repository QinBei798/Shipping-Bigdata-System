import { ref, onMounted, onUnmounted } from 'vue'

export function useScreenScale(baseW = 1920, baseH = 1080) {
  const scale = ref(1)

  function updateScale() {
    const scaleX = window.innerWidth / baseW
    const scaleY = window.innerHeight / baseH
    scale.value = Math.min(scaleX, scaleY)
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateScale)
  })

  return { scale }
}
