import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { usePeerConnection } from '@/composables/usePeerConnection'
const { connect, call, startPeerConnection } = usePeerConnection()

export const usePeerStore = defineStore('peer', () => {
  const peers = ref([])
  const myPeer = ref(null)
  const myStream = ref(null)

  const state = ref({
    loading: false,
    completed: false,
    error: false,
  })

  async function startMyPeer() {
    state.value.loading = true
    state.value.completed = false

    try {
      myPeer.value = await startPeerConnection((connection) => {
        peers.value.push(connection)
      })

      state.value.error = false
    } catch (err) {
      state.value.error = true
      console.error(err)
    } finally {
      state.value.completed = true
      state.value.loading = false
    }
    console.log('terminei')
  }

  function setMyStream(stream) {
    myStream.value = stream
  }

  async function connectToPeer(peerId) {
    console.log('chamei aqui')
    const connection = await connect(myPeer.value, peerId)
    peers.value.push(connection)
  }

  async function callPeer(peerId) {
    const kall = call(myPeer.value, peerId, myStream.value)
    peers.value.push(kall)
  }

  async function spawn(value) {
    peers.value.forEach((peer) => {
      peer.send(value)
    })
  }

  return {
    state,
    connectToPeer,
    myPeer,
    myStream,
    startMyPeer,
    setMyStream,
    peers,
    callPeer,
    spawn,
  }
})
