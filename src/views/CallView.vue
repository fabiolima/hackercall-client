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
import { useMediaDevices } from '@/composables/useMediaDevices'

const { myPeer, startPeerConnection, answerCallsWith, call } = usePeerConnection()
const { getUserMedia } = useMediaDevices()
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
  const stream = await getUserMedia()

  if (stream) {
    localStream.value = stream
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
</script>
