import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import { io } from 'socket.io-client'
import { usePeerStore } from './peer'

const useSocketStore = defineStore('socket', () => {
  const { myPeer } = storeToRefs(usePeerStore())

  const socket = ref(null)

  const startConnection = () => {
    socket.value = io(import.meta.env.VITE_SERVER_URL)

    socket.value.on('connect', () => {
      console.log(socket.value.id, 'connected.')
    })

    socket.value.on(myPeer.value.id, (message) => {
      console.log('recebi uma mensagem pra mim', message)
    })

    socket.value.on('data', (m) => {
      console.log('recebi um data', m)
    })
  }

  return {
    socket,
    startConnection,
  }
})

export { useSocketStore }
