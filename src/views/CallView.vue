<template>
  <main class="bg-gray-900 h-full max-h-full w-full p-8 flex flex-col">
    <div class="flex justify-between">
      <h1 class="text-center mb-4 text-gray-100 text-3xl font-bold underline">Hackercall</h1>
      <button class="text-white" v-if="myPeer" @click="copyJoinCallCommand">Call me</button>
      <button class="text-white" v-if="myPeer" @click="copyMyPeerId">{{ myPeer.id }}</button>
    </div>

    <div class="flex flex-col lg:flex-row h-full gap-4">
      <MyStream></MyStream>

      <div class="guests-container grow w-full h-full">
        <PeerStream v-for="peer in peers" :call="peer" />
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, watchEffect } from 'vue'
import MyStream from '@/components/MyStream.vue'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'
import PeerStream from '@/components/PeerStream.vue'
import { useRoute } from 'vue-router'

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
