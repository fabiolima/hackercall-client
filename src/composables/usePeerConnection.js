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

  const startPeerConnection = async (onCallHandler) => {
    const url = new URL(import.meta.env.VITE_SERVER_URL)

    const peer = new Peer({
      // host: 'hackercall-peerjs-server.onrender.com',
      // secure: true,
      // path: '/',
      //
      host: url.hostname,
      port: url.port,
      secure: import.meta.env.PROD,
      path: import.meta.env.VITE_PEER_PATH,
    })

    await openConnectionAsync(peer)
    // peer.on('connection', onConnectionHandler)
    peer.on('call', onCallHandler)

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
