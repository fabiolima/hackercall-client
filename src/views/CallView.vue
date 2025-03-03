<template>
  <h1>Hackercall</h1>
  {{ myPeer?.id }}
  <button @click="copyJoinCallCommand">Compartilhar meu peerId {{ myPeer?.id }}</button>
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
import { useRoute } from 'vue-router'
import { usePeerConnection } from '@/composables/usePeerConnection'

const { myPeer, startPeerConnection, answerCallsWith, call } = usePeerConnection()

const localVideo = ref(null)
const remoteVideo = ref(null)

const route = useRoute()

const localStream = ref(null)

const copyJoinCallCommand = () => {
  const baseUrl = import.meta.env.DEV
    ? `http://localhost:3339/?peerId=${myPeer.value.id}`
    : `https://hackercall-client.onrender.com/?peerId=${myPeer.value.id}`

  navigator.clipboard.writeText(baseUrl)
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
  await startPeerConnection()
  answerCallsWith(localStream, onCallAnswered)

  if (route.query.peerId) {
    callPeer(route.query.peerId)
  }
})

const onCallAnswered = (remoteStream) => {
  remoteVideo.value.srcObject = remoteStream
}

const callPeer = (peerId) => {
  call(peerId, localStream.value, onCallAnswered)
}

const checkMediaDevices = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices()
  const hasCamera = devices.some((device) => device.kind === 'videoinput')
  const hasMicrophone = devices.some((device) => device.kind === 'audioinput')

  return { hasCamera, hasMicrophone }
}
</script>
