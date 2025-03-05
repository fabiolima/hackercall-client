<template>
  <h1 class="text-white">aloo</h1>
  <video ref="video" autoplay playsinline=""></video>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps(['call'])
const stream = ref(null)
console.log(props)
const video = ref(null)
onMounted(() => {
  console.log(props.call)

  props.call.on('stream', (peerStream) => {
    stream.value = peerStream
    video.value.srcObject = peerStream
  })
})
</script>
