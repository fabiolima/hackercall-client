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

  const startPeerConnection = async (onConnectionHandler) => {
    const peer = new Peer({
      host: 'hackercall-peerjs-server.onrender.com',
      secure: true,
      path: '/',
    })

    await openConnectionAsync(peer)
    peer.on('connection', onConnectionHandler)

    return peer
  }

  const setOnCallHandler = (peer, handler) => {
    peer.on('call', handler)
  }

  const answerCallsWith = (streamRef, onStreamHandler) => {
    myPeer.value.on('call', (call) => {
      call.answer(streamRef.value)
      call.on('stream', onStreamHandler)
    })
  }

  const connect = (peer, peerId) => {
    return new Promise((resolve) => {
      const connection = peer.connect(peerId)
      connection.on('open', () => {
        resolve(connection)
      })

      connection.on('error', (err) => {
        console.log(err, 'tive um erro aqui ')
      })
    })
  }

  const call = (peer, peerId, stream) => {
    const kall = peer.call(peerId, stream)

    return kall
    // kall.on('stream', onStreamHandler)
    // kall.on('error', (err) => {
    //   console.error(err)
    // })
  }

  return {
    call,
    myPeer,
    answerCallsWith,
    startPeerConnection,
    setOnCallHandler,
    connect,
  }
}

export { usePeerConnection }
