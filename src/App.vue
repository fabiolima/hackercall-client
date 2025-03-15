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

  <CallSettings />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMediaStore } from '@/stores/media'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'
import { useStartupAnimation } from './composables/useStartupAnimation'
import { onKeyStroke } from '@vueuse/core'
import CallView from './views/CallView.vue'
import LoadingWindow from './components/LoadingWindow.vue'
import CallSettings from './components/CallSettings.vue'
import { useCallSettingsStore } from './stores/settings'

const settingsStore = useCallSettingsStore()

const { showSettingsWindow } = settingsStore

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

onKeyStroke(
  's',
  () => {
    showSettingsWindow()
  },
  { dedupe: true },
)

const isLoading = computed(() => {
  return (
    !mediaState.value.completed ||
    mediaState.value.loading ||
    !peerState.value.completed ||
    peerState.value.loading
  )
})

settingsStore.$subscribe((mutation, state) => {
  if (state.settings.rememberMe) {
    localStorage.setItem('hackercall::settings', JSON.stringify(state.settings))
  } else {
    localStorage.removeItem('hackercall::settings')
  }
})
</script>
