<template>
  <main class="bg-gray-900 h-full max-h-full w-full p-8 flex flex-col">
    <h1 class="text-center mb-4 text-gray-100 text-3xl font-bold underline">Hackercall</h1>

    <div class="flex flex-col lg:flex-row h-full gap-4">
      <div
        class="border-2 rounded-3xl border-gray-100 grow flex items-center justify-center"
        v-if="!loading"
      >
        <div ref="myAvatar" class="avatar rounded-full w-fit relative">
          <div class="sonar"></div>
          <div class="sonar-ring"></div>
          <img
            src="/avatar/anon.png"
            class="w-44 rounded-full overflow-hidden h-auto p-6 bg-white"
          />
        </div>
      </div>
      <div class="border-2 rounded-3xl border-gray-100 grow flex items-center justify-center">
        <div class="avatar rounded-full overflow-hidden w-fit">
          <img src="/avatar/anon.png" class="w-44 overflow-hidden h-auto p-6 bg-white" />
        </div>
      </div>
    </div>
  </main>
  <!---->
  <!-- <section v-if="!loading"> -->
  <!--   <div v-if="async () => !(await hasCamera()) && (await hasMicrophone())"> -->
  <!--     <Avatar /> -->
  <!--   </div> -->
  <!-- </section> -->

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
import Avatar from '@/components/Avatar.vue'

const { myPeer, startPeerConnection, answerCallsWith, call } = usePeerConnection()
const { getUserMedia, loading, hasCamera, hasMicrophone } = useMediaDevices()
const localVideo = ref(null)
const remoteVideo = ref(null)
const myAvatar = ref(null)

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

    const sonar = myAvatar.value.querySelector('.sonar')

    function animateWaves() {
      analyser.getByteFrequencyData(dataArray)

      // Calcula o volume médio do áudio
      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength

      if (averageVolume <= 50) {
        sonar.style.transform = 'scale(1)'
      }

      // Se o volume for alto o suficiente, cria uma onda
      if (averageVolume > 50 && averageVolume <= 55) {
        sonar.style.transform = 'scale(1.1)'

        // const wave = document.createElement('div')
        // wave.classList.add('wave')
        // waveContainer.appendChild(wave)
        //
        // // Remove a onda após a animação
        // setTimeout(() => {
        //   wave.remove()
        // }, 500)
      }

      if (averageVolume > 55 && averageVolume <= 58) {
        sonar.style.transform = 'scale(1.2)'
      }
      if (averageVolume > 58) {
        sonar.style.transform = 'scale(1.3)'
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

<style>
.sonar {
  content: '';
  width: 100%;
  height: 100%;
  display: block;
  background-color: #ffffff1a;
  border-radius: 50%;
  transform: scale(1);
  position: absolute;
  z-index: -1;
  transition: transform 180ms;
}
.avatar {
  z-index: 10;
  /* box-shadow: 0px 0px 1px 1px #ffffff1a; */
}
.pulse {
  animation: pulse-animation 1s infinite;
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0px #ffffff1a;
  }
  100% {
    box-shadow: 0 0 0 20px #000;
  }
}
</style>
