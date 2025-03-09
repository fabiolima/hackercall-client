<template>
  <main class="bg-gray-900 h-full max-h-full w-full p-8 flex flex-col">
    <CallSettings />

    <div class="flex flex-col lg:flex-row h-full gap-4 mt-16">
      <MyStream></MyStream>

      <!-- <div class="guests-container grow w-full h-full"> -->
      <!--   <PeerStream v-for="peer in peers" :call="peer" /> -->
      <!-- </div> -->
    </div>
  </main>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
import MyStream from '@/components/MyStream.vue'
import CallSettings from '@/components/CallSettings.vue'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'
import PeerStream from '@/components/PeerStream.vue'
import { useRoute } from 'vue-router'

import { useCallSettingsStore } from '@/stores/settings'

const callSettingsStore = useCallSettingsStore()
const { showSettingsWindow } = callSettingsStore
const peerStore = usePeerStore()

const { connectToPeer, callPeer } = peerStore
const { peers, myPeer, myStream } = storeToRefs(peerStore)

const route = useRoute()

const copyJoinCallCommand = () => {
  const baseUrl = import.meta.env.DEV
    ? `http://localhost:3339/?peerId=${myPeer.value.id}`
    : `https://hackercall-client.onrender.com/?peerId=${myPeer.value.id}`

  navigator.clipboard.writeText(baseUrl)
}
const copyMyPeerId = () => {
  navigator.clipboard.writeText(myPeer.value.id)
}

onMounted(async () => {
  showSettingsWindow()
  // if (route.query.peerId) {
  //   callPeer(route.query.peerId)
  // }
})

watchEffect(async () => {
  if (myPeer.value && myStream.value && route.query.peerId) {
    await connectToPeer(route.query.peerId)
  }
})
</script>
