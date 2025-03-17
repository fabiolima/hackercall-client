<template>
  <main class="bg-[#0a0a0a] h-full max-h-full w-full p-8 flex flex-col">
    <div class="flex gap-4 justify-center">
      <button
        ref="settingsBtn"
        class="text-2xl text-white hover:text-green-500 cursor-pointer font-iceland"
        @click="showSettingsWindow"
      >
        [s] settings
      </button>

      <button
        @click="copyJoinCallCommand"
        class="text-white hover:text-green-500 text-2xl font-iceland cursor-pointer"
      >
        [i] invite
      </button>
    </div>
    <div class="flex flex-col lg:flex-row h-full gap-4 mt-16 z-50 overflow-hidden">
      <MyStream></MyStream>

      <PeerStream v-for="peer in peers" :call="peer" :key="peer.id" />
    </div>
  </main>
</template>

<script setup>
import MyStream from '@/components/MyStream.vue'
import PeerStream from '@/components/PeerStream.vue'
import { usePeerStore } from '@/stores/peer'
import { useRoomStore } from '@/stores/room'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useCallSettingsStore } from '@/stores/settings'
import { onKeyStroke } from '@vueuse/core'

const callSettingsStore = useCallSettingsStore()
const { showSettingsWindow } = callSettingsStore

const peerStore = usePeerStore()
const roomStore = useRoomStore()

const { peers, myPeer } = storeToRefs(peerStore)
const { room } = storeToRefs(roomStore)

const route = useRoute()

const settingsBtn = ref(null)

const copyJoinCallCommand = () => {
  const baseUrl = import.meta.env.DEV
    ? `http://localhost:3339/?joinRoom=${room.value}`
    : `https://hackercall-client.onrender.com/?peerId=${myPeer.value.id}`

  navigator.clipboard.writeText(baseUrl)
}

onKeyStroke('s', () => {
  settingsBtn.value.classList.remove('text-white')
  settingsBtn.value.classList.add('text-green-500')

  setTimeout(() => {
    settingsBtn.value.classList.remove('text-green-500')
    settingsBtn.value.classList.add('text-white')
  }, 120)
})

onMounted(() => {
  if (route.query.peerId) {
    console.log('achei um peerId', route.query.peerId)
    peerStore.callPeer(route.query.peerId)
  }
})
</script>
