<template>
  <TransitionGroup
    name="toast"
    tag="section"
    class="absolute z-50 bottom-0 p-8 w-full overflow-hidden"
    enter-from-class="opacity-0 translate-y-full"
    enter-active-class="transition-all duration-500 ease-in-out"
    leave-to-class="opacity-0 translate-y-full"
    leave-active-class="transition-all duration-500 ease-in-out"
    move-class="transition-all duration-500 ease-in-out"
  >
    <div
      v-for="(request, index) in requests"
      :key="request.username"
      class="bg-blue-500 p-4 text-white flex gap-4"
    >
      <p class="font-iceland text-2xl grow-1">
        User <b>{{ request.username }}</b> requested to join
      </p>
      <button class="bg-red-500 text-white cursor-pointer font-iceland text-2xl px-4">Deny</button>
      <button
        class="bg-green-500 text-white cursor-pointer font-iceland text-2xl px-4"
        @click="onAcceptRequest(request, index)"
      >
        Accept
      </button>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref, watch, watchEffect } from 'vue'
import { useSocketStore } from '@/stores/socket'
import { usePeerStore } from '@/stores/peer'
import { useRoomStore } from '@/stores/room'
import { storeToRefs } from 'pinia'

const socketStore = useSocketStore()
const peerStore = usePeerStore()
const roomStore = useRoomStore()

const { acceptRequest } = roomStore
const { callPeer } = peerStore
const { socket } = storeToRefs(socketStore)
const { myPeer } = storeToRefs(peerStore)

const requests = ref([])

const onAcceptRequest = async (request, index) => {
  await acceptRequest(request)
  removeToast(index)
}

const removeToast = (index) => {
  requests.value.splice(index, 1)
}

const bindListener = () => {
  socket.value.on(myPeer.value.id, (message) => {
    const { type, payload } = message

    if (type == 'join-request') {
      console.log('sou do tipo join-request', payload)
      requests.value.push({ ...payload })
    }

    if (type == 'request-accepted') {
      payload.peers.forEach((peerId) => {
        callPeer(peerId)
        console.log('liguei')
      })

      console.log('aceitaram meu convite', payload)
    }
  })
}

watchEffect(() => {
  if (myPeer.value && socket.value) {
    bindListener()
  }
})
</script>
