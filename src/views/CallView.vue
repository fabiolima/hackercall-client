<template>
  <h1>Hackercall</h1>
  {{ myPeer?.id }}
  <button @click="copyJoinCallCommand">Compartilhar meu peerId {{ myPeer?.id }}</button>
  <button @click="callPeer(route.query.peerId)" v-if="route.query.peerId">Call Peer</button>
  <Avatar />
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
import Avatar from '@/components/Avatar.vue'

const { myPeer, startPeerConnection, answerCallsWith, call } = usePeerConnection()
const { getUserMedia } = useMediaDevices()
const localVideo = ref(null)
const remoteVideo = ref(null)

const route = useRoute()

const localStream = ref(null)

const setupAudioAnalyser = async (stream) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const microphone = audioContext.createMediaStreamSource(stream)
    microphone.connect(analyser)
    analyser.fftSize = 256

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    function animateWaves() {
      analyser.getByteFrequencyData(dataArray)

      // Calcula o volume médio do áudio
      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength

      // Se o volume for alto o suficiente, cria uma onda
      if (averageVolume > 50) {
        console.log('volume alto')
        // const wave = document.createElement('div')
        // wave.classList.add('wave')
        // waveContainer.appendChild(wave)
        //
        // // Remove a onda após a animação
        // setTimeout(() => {
        //   wave.remove()
        // }, 500)
      }

      requestAnimationFrame(animateWaves)
    }

    animateWaves()
  } catch (error) {
    console.error('Erro ao acessar o microfone:', error)
  }
}

const copyJoinCallCommand = () => {
  const baseUrl = import.meta.env.DEV
    ? `http://localhost:3339/?peerId=${myPeer.value.id}`
    : `https://hackercall-client.onrender.com/?peerId=${myPeer.value.id}`

  navigator.clipboard.writeText(baseUrl)
}

const startMediaStream = async () => {
  const stream = await getUserMedia()

  if (stream.getAudioTracks().length) await setupAudioAnalyser(stream)

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
