import { ref } from 'vue'
import Peer from 'peerjs'

const usePeerConnection = () => {
  const myPeer = ref(null)

  const openConnectionAsync = (peer) => {
    return new Promise((resolve) => {
      peer.on('open', (id) => {
        resolve(id)
      })
    })
  }

  const startPeerConnection = async () => {
    const peer = new Peer({
      host: 'hackercall-peerjs-server.onrender.com',
      secure: true,
      path: '/',
    })

    await openConnectionAsync(peer)
  }

  const answerCallsWith = (streamRef, onStreamHandler) => {
    myPeer.value.on('call', (call) => {
      call.answer(streamRef.value)
      call.on('stream', onStreamHandler)
    })
  }

  const call = (peerId, stream, onStreamHandler) => {
    const kall = myPeer.value.call(peerId, stream)
    kall.on('stream', onStreamHandler)
    kall.on('error', (err) => {
      console.error(err)
    })
  }

  return {
    call,
    myPeer,
    answerCallsWith,
    startPeerConnection,
  }
}

export { usePeerConnection }
