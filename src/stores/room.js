import { defineStore } from 'pinia'
import { ref } from 'vue'

const useRoomStore = defineStore('room', () => {
  const createState = ref({
    loading: false,
    completed: false,
    error: false,
  })

  const room = ref(null)

  /**
   * Request permission to join room.
   *
   * @param payload - { roomId: integer, username: string, peerId: string }
   */
  const requestJoinRoom = async (payload) => {
    const url = `${import.meta.env.VITE_SERVER_URL}/rooms/request-join`

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  }

  const createRoom = async (ownerId) => {
    createState.value.loading = true
    createState.value.completed = false

    const url = `${import.meta.env.VITE_SERVER_URL}/rooms`

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ ownerId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const createdRoom = await response.json()

    room.value = createdRoom.id

    return createdRoom
  }

  /**
   * Notify guest that he can join.
   *
   * @param request - { roomId: string, username: string, peerId: string }
   */
  const acceptRequest = async (request) => {
    const url = `${import.meta.env.VITE_SERVER_URL}/rooms/accept-request`

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('mandei o accept')
    return data
  }

  return {
    acceptRequest,
    room,
    requestJoinRoom,
    createState,
    createRoom,
  }
})

export { useRoomStore }
