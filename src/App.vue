<template>
  <div
    ref="loadingWindow"
    class="z-100 absolute top-0 left-0 bg-blue-700 h-full w-full flex items-center justify-center"
  >
    <LoadingWindow />
  </div>

  <div ref="appWindow" class="-translate-y-full h-full w-full">
    <CallView v-if="!isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMediaStore } from '@/stores/media'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'
import CallView from './views/CallView.vue'
import LoadingWindow from './components/LoadingWindow.vue'
import { useStartupAnimation } from './composables/useStartupAnimation'

const mediaStore = useMediaStore()
const peerStore = usePeerStore()

const { requestAudioInput } = mediaStore
const { startMyPeer } = peerStore

const { state: peerState } = storeToRefs(peerStore)
const { state: mediaState } = storeToRefs(mediaStore)

const loadingWindow = ref(null)
const appWindow = ref(null)

onMounted(async () => {
  useStartupAnimation({ appWindow, loadingWindow })
  await requestAudioInput()
  await startMyPeer()
})

const isLoading = computed(() => {
  return (
    !mediaState.value.completed ||
    mediaState.value.loading ||
    !peerState.value.completed ||
    peerState.value.loading
  )
})
</script>
