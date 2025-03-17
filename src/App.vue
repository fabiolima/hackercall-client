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

  <JoinRoomRequests />
  <CallSettings />
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useMediaStore } from '@/stores/media'
import { usePeerStore } from '@/stores/peer'
import { useRoomStore } from '@/stores/room'
import { useSocketStore } from '@/stores/socket'
import { storeToRefs } from 'pinia'
import { useStartupAnimation } from '@/composables/useStartupAnimation'
import { onKeyStroke } from '@vueuse/core'
import CallView from '@/views/CallView.vue'
import LoadingWindow from '@/components/LoadingWindow.vue'
import CallSettings from '@/components/CallSettings.vue'
import { useCallSettingsStore } from '@/stores/settings'
import JoinRoomRequests from '@/components/JoinRoomRequests.vue'
import { useRoute } from 'vue-router'

const mediaStore = useMediaStore()
const peerStore = usePeerStore()
const roomStore = useRoomStore()
const socketStore = useSocketStore()
const settingsStore = useCallSettingsStore()

const { requestAudioInput } = mediaStore
const { startMyPeer } = peerStore
const { createRoom, requestJoinRoom } = roomStore
const { startConnection: startSocketConnection } = socketStore
const { showSettingsWindow } = settingsStore

const { state: peerState, myPeer } = storeToRefs(peerStore)
const { state: mediaState } = storeToRefs(mediaStore)
const { settings } = storeToRefs(settingsStore)
const { socket } = storeToRefs(socketStore)
const loadingWindow = ref(null)
const appWindow = ref(null)

const route = useRoute()

onMounted(async () => {
  useStartupAnimation({ appWindow, loadingWindow })
  await requestAudioInput()
  await startMyPeer()
  startSocketConnection()

  if (route.query.joinRoom) {
    const payload = {
      roomId: route.query.joinRoom,
      username: settings.value.username,
      peerId: myPeer.value.id,
    }

    await requestJoinRoom(payload)
  } else {
    await createRoom(myPeer.value.id)
  }

  window.addEventListener('beforeunload', onBeforeUnmountHandler)
})

const onBeforeUnmountHandler = () => {
  console.log('chamei a saida aqui')
  if (socket.value) socket.value.disconnect()
}

onUnmounted(onBeforeUnmountHandler)

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
