<template>
  <h1>Hackercall</h1>
  {{ myPeerId }} asd
  <button @click="copyJoinCallCommand">Compartilhar meu peerId {{ myPeerId }}</button>
  <button @click="callPeer(route.query.peerId)" v-if="route.query.peerId">Call Peer</button>
  <div v-if="!localStream">
    <p>Clique no botão abaixo para iniciar a chamada.</p>
    <button @click="startCall">Iniciar Chamada</button>
  </div>
  <div v-else>
    <video
      ref="localVideo"
      autoplay="true"
      playsinline="true"
      muted
      style="border: 2px solid red"
    ></video>
    <video
      ref="remoteVideo"
      autoplay="true"
      playsinline="true"
      style="border: 2px solid green"
    ></video>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import Peer from 'peerjs'
import { useRoute } from 'vue-router'

const myPeerId = ref('')
const localVideo = ref(null)
const remoteVideo = ref(null)

const route = useRoute()

let peer
const localStream = ref(null)

const copyJoinCallCommand = () => {
  navigator.clipboard.writeText(`https://hackercall-client.onrender.com/?peerId=${myPeerId.value}`)
}

const onPeerCall = (call) => {
  console.log('alguem chamou', call)
  call.answer(localStream.value)
  call.on('stream', (remoteStream) => {
    console.log('recebi alguma stream')
    remoteVideo.value.srcObject = remoteStream
  })
}

const openMyPeerConnection = () => {
  return new Promise((resolve) => {
    peer.on('open', (id) => {
      resolve(id)
    })
  })
}

const initPeer = async () => {
  peer = new Peer({
    host: 'hackercall-peerjs-server.onrender.com', // Substitua pelo endereço do seu servidor
    secure: true, // Usar HTTPS
    path: '/',
  })

  myPeerId.value = await openMyPeerConnection()
  peer.on('call', onPeerCall)

  if (route.query.peerId) {
    callPeer(route.query.peerId)
  }
}

const startMediaStream = async () => {
  const { hasCamera, hasMicrophone } = await checkMediaDevices()

  console.log('entrei', hasCamera, hasMicrophone)

  if (hasCamera || hasMicrophone) {
    localStream.value = await navigator.mediaDevices.getUserMedia({
      video: hasCamera,
      audio: hasMicrophone,
    })
    await nextTick()
    localVideo.value.srcObject = localStream.value
  }
}

onMounted(async () => {
  await startMediaStream()
  await initPeer()
})

const callPeer = (peerId) => {
  console.log('ligando para o peer', peerId)
  const call = peer.call(peerId, localStream.value)
  call.on('stream', (remoteStream) => {
    console.log('liguei pro outro peer e recebi de volta a stream', remoteStream)
    remoteVideo.value.srcObject = remoteStream
    console.log(remoteVideo.value.srcObject)
  })

  call.on('error', (err) => {
    console.error(err)
  })
}

const checkMediaDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const hasCamera = devices.some((device) => device.kind === 'videoinput')
  const hasMicrophone = devices.some((device) => device.kind === 'audioinput')

  return { hasCamera, hasMicrophone }
}
</script>
