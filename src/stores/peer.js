import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePeerConnection } from '@/composables/usePeerConnection'
const { call, startPeerConnection: start, answerCallsWith, setOnCallHandler } = usePeerConnection()

export const usePeerStore = defineStore('peer', () => {
  const peers = ref([])
  const myPeer = ref(null)
  const myStream = ref(null)

  async function startMyPeer() {
    myPeer.value = await start((call) => {
      call.answer(myStream.value)
      peers.value.push(call)
    })
  }

  function setMyStream(stream) {
    myStream.value = stream
  }

  async function callPeer(peerId) {
    console.log('vou ligar pro peer', peerId)
    const kall = call(myPeer.value, peerId, myStream.value)
    peers.value.push(kall)
  }

  return { myPeer, myStream, startMyPeer, setMyStream, peers, callPeer }
})
