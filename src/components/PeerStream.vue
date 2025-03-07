<template>
  <h1 class="text-white">aloo</h1>
  <video ref="video" autoplay playsinline=""></video>
  <img ref="image" />
  <canvas ref="canvas" id="videoCanvas" width="800" height="600"></canvas>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps(['call'])
const stream = ref(null)
const video = ref(null)
const image = ref(null)

const canvas = ref(null)

onMounted(() => {
  props.call.on('data', (data) => {
    if (data instanceof Uint8Array) {
      const blob = new Blob([data], { type: 'image/jpeg' }) // Converte de volta para Blob
      let ctx = canvas.value.getContext('2d')

      // Cria uma nova imagem a partir do Blob
      const img = new Image()
      img.onload = function () {
        ctx.drawImage(img, 0, 0, canvas.value.width, canvas.value.height) // Desenha a imagem no canvas
        URL.revokeObjectURL(img.src) // Revoga a URL
      }
      img.src = URL.createObjectURL(blob) // Atribui a URL ao src da imagem
    }
  })
})
</script>
