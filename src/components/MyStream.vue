<template>
  <div
    ref="canvasContainer"
    id="my-stream-canvas-container"
    class="h-full w-full overflow-hidden"
  ></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useCube } from '@/composables/useCube'
import { usePeerStore } from '@/stores/peer'
import { useMediaStore } from '@/stores/media'
import { storeToRefs } from 'pinia'
import { useCallSettingsStore } from '@/stores/settings'

const { settings } = storeToRefs(useCallSettingsStore())
const { stream } = storeToRefs(useMediaStore())
const { start: startMyCube, fitCanvas } = useCube()
const { peers } = storeToRefs(usePeerStore())

const canvasContainer = ref(null)

onMounted(async () => {
  setTimeout(() => {
    startMyCube({ container: canvasContainer.value, stream: stream.value, settings: settings })
    canvasContainer.value.focus()
  }, 1000 * 2)
})

watch(peers.value, (val) => {
  console.log('alterei aqui', val)
  fitCanvas()
})
</script>
