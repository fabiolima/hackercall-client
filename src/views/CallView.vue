<template>
  <main class="bg-gray-900 h-full max-h-full w-full p-8 flex flex-col">
    <div class="flex">
      <CallSettings class="grow" />
      <div class="flex justify-end grow">
        <button
          @click="copyJoinCallCommand"
          class="text-white text-2xl font-nothing tracking-[2px] cursor-pointer"
        >
          invite
        </button>
      </div>
    </div>
    <div class="flex flex-col lg:flex-row h-full gap-4 mt-16">
      <MyStream></MyStream>

      <div v-if="peers.length" class="guests-container grow w-full h-full">
        <PeerStream v-for="peer in peers" :call="peer" :key="peer.id" />
      </div>
    </div>
  </main>
</template>

<script setup>
import MyStream from '@/components/MyStream.vue'
import CallSettings from '@/components/CallSettings.vue'
import PeerStream from '@/components/PeerStream.vue'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'

const peerStore = usePeerStore()
const { peers, myPeer } = storeToRefs(peerStore)
const copyJoinCallCommand = () => {
  const baseUrl = import.meta.env.DEV
    ? `http://localhost:3339/?peerId=${myPeer.value.id}`
    : `https://hackercall-client.onrender.com/?peerId=${myPeer.value.id}`

  navigator.clipboard.writeText(baseUrl)
}
</script>
