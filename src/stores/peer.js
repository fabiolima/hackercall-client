import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePeerConnection } from '@/composables/usePeerConnection'
const { startPeerConnection: start } = usePeerConnection()

export const usePeerStore = defineStore('peer', () => {
  const peers = ref([])
  const myPeer = ref(null)
  const myStream = ref(null)

  async function startMyPeer() {
    myPeer.value = await start()
  }

  function setMyStream(stream) {
    myStream.value = stream
  }

  async function callPeer() {}

  return { myStream, startMyPeer, setMyStream }
})
