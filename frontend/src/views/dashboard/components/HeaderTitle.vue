<template>
  <header
    class="flex items-center justify-between px-8 h-full select-none"
    style="background: linear-gradient(180deg, rgba(0,150,255,0.12) 0%, rgba(0,150,255,0.02) 100%); border-bottom: 1px solid rgba(0,200,200,0.25);"
  >
    <div class="flex items-center gap-4">
      <div class="w-1 h-6 bg-[#0ff]" style="box-shadow: 0 0 10px #0ff;"></div>
      <h1 class="text-xl font-bold tracking-wider" style="color: var(--color-text-primary);">
        航运大数据可视化平台
      </h1>
    </div>
    <div class="flex items-center gap-6 text-sm" style="color: var(--color-text-secondary);">
      <span>{{ currentTime }}</span>
      <span class="flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-green-400 inline-block" style="box-shadow:0 0 6px #0f0;"></span>
        数据更新中
      </span>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentTime = ref('')

function updateTime() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  currentTime.value = `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

let timer
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})
onUnmounted(() => clearInterval(timer))
</script>
