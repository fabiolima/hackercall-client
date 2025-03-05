<template>
  <h1>alo</h1>

  <video id="localVideo" ref="localVideo" autoplay muted></video>

  <video id="remoteVideo" ref="remoteVideo" autoplay muted></video>

  <div id="sketch-container"></div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useMediaDevices } from '@/composables/useMediaDevices'
import p5 from 'p5'
import { useSketch } from '@/composables/useSketch'

const { getUserMedia } = useMediaDevices()
const localVideo = ref(null)
const remoteVideo = ref(null)
const myp5 = ref(null)

onMounted(async () => {
  const stream = await getUserMedia()

  console.log(stream)
  localVideo.value.srcObject = stream
  myp5.value = new p5(useSketch, 'sketch-container')
  // await nextTick()
  // const ascStream = applyASCIIFilter(localVideo.value)
})

// Função para aplicar o filtro ASCII
const applyASCIIFilter = (video) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const asciiChars = ['@', '#', 'S', '%', '?', '*', '+', ';', ':', ',', '.']

  function drawASCII() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let asciiImage = ''

    for (let y = 0; y < canvas.height; y += 10) {
      for (let x = 0; x < canvas.width; x += 5) {
        const offset = (y * canvas.width + x) * 4
        const brightness = (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3
        const charIndex = Math.floor((brightness / 255) * (asciiChars.length - 1))
        asciiImage += asciiChars[charIndex]
      }
      asciiImage += '\n'
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = '10px monospace'
    ctx.fillText(asciiImage, 0, 10)
  }

  setInterval(drawASCII, 100)
  return canvas.captureStream()
}
</script>
