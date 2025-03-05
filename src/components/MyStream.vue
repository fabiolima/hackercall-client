<template>
  <div
    class="w-full overflow-hidden border-2 relative border-gray-100 grow flex items-center justify-center"
  >
    <template v-if="hasAudioTrack && !hasVideoTrack">
      <div ref="myAvatar" class="avatar rounded-full w-fit relative">
        <div ref="sonar" class="sonar"></div>
        <div class="sonar-ring"></div>
        <img src="/avatar/anon.png" class="w-44 rounded-full overflow-hidden h-auto p-6 bg-white" />
      </div>
    </template>
    <template v-if="true">
      <div
        id="my-stream-canvas-container"
        class="h-full w-full flex items-center justify-center"
      ></div>
      <!-- <video -->
      <!--   ref="myVideo" -->
      <!--   autoplay="true" -->
      <!--   playsinline="true" -->
      <!--   muted -->
      <!--   class="rotate-y-180 w-full h-full object-cover absolute max-w-none" -->
      <!-- ></video> -->
    </template>
  </div>
</template>

<script setup>
import { watch, computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { useMediaDevices } from '@/composables/useMediaDevices'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'
import { useAudioAnalyser } from '@/composables/useAudioAnalyser'
import { useSketch } from '@/composables/useSketch'
import p5 from 'p5'

const peerStore = usePeerStore()

const { getUserMedia } = useMediaDevices()
const { setMyStream, startMyPeer } = peerStore
const { myStream } = storeToRefs(peerStore)
const { setupAudioAnalyser, averageVolume } = useAudioAnalyser()

const myAvatar = ref(null)
const sonar = ref(null)
const myVideo = ref(null)

const { newSketch, capture, capturing } = useSketch()

onMounted(async () => {
  await startMyPeer()

  newSketch('my-stream-canvas-container')
  // const myp5 = new p5(useSketch, 'my-stream-canvas-container')
  // debugger
  // const stream = await getUserMedia()
  // setMyStream(stream)
})

const hasAudioTrack = computed(() => {
  if (!myStream.value) return false

  return myStream.value.getAudioTracks().length > 0
})

const hasVideoTrack = computed(() => {
  if (!myStream.value) return false

  return myStream.value.getVideoTracks().length > 0
})

watch(averageVolume, (value) => {
  if (value <= 50) {
    sonar.value.style.transform = 'scale(1)'
  }

  if (value > 50 && value <= 55) {
    sonar.value.style.transform = 'scale(1.1)'
  }

  if (value > 55 && value <= 58) {
    sonar.value.style.transform = 'scale(1.2)'
  }

  if (value > 58) {
    sonar.value.style.transform = 'scale(1.3)'
  }
})

watchEffect(async () => {
  if (hasVideoTrack.value) {
    await nextTick()
    myVideo.value.srcObject = myStream.value
  }
})

watchEffect(async () => {
  if (hasAudioTrack.value && !hasVideoTrack.value) {
    console.log('entrei aqui')
    // Await for DOM rendering
    await nextTick()

    setupAudioAnalyser(myStream.value)
  }
})
</script>
