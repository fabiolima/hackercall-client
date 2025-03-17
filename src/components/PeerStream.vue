<template>
  <div ref="canvasContainer" id="peer-canvas-container" class="h-full w-full overflow-hidden"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useMediaStore } from '@/stores/media'
import { useCallSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { useCube } from '@/composables/useCube'

const { start: startMyCube } = useCube()

const canvasContainer = ref(null)

const props = defineProps(['call'])

const { settings } = storeToRefs(useCallSettingsStore())
const { stream } = storeToRefs(useMediaStore())

onMounted(() => {
  props.call.answer(stream.value)
  props.call.on('stream', (incomingStream) => {
    const aCtx = new AudioContext()
    const microphone = aCtx.createMediaStreamSource(incomingStream)
    const destination = aCtx.destination

    microphone.connect(destination)

    startMyCube({ container: canvasContainer.value, stream: incomingStream, settings: settings })
  })
})

onUnmounted(() => {
  // subscription.unsubscribe()
})
</script>
