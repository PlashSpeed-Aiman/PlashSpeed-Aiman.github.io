<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const clockState = ref(new Date().toLocaleTimeString('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
}))

let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    clockState.value = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<template>
  <div class="px-3 py-1.5 rounded-md border border-stone-300 bg-stone-50 hover:bg-stone-100 transition-colors duration-200">
    <span class="font-mono text-sm text-stone-950 tabular-nums">
      {{ clockState }}
    </span>
  </div>
</template>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>