<template>
  <div id="peer-canvas-container" class="h-full w-full flex items-center justify-center"></div>
</template>

<script setup>
import { Observable } from 'rxjs'
import { onMounted, onUnmounted, ref } from 'vue'
import { usePeerSketch } from '@/composables/usePeerSketch'

const { newPeerSketch } = usePeerSketch()
const props = defineProps(['call'])
const facePositionObservable = ref(null)

// let subscription = null

onMounted(() => {
  facePositionObservable.value = new Observable((subscriber) => {
    props.call.on('data', (data) => {
      subscriber.next(data)
    })
  })

  newPeerSketch('peer-canvas-container', facePositionObservable.value)

  // subscription = facePositionObservable.value.subscribe((d) => {
  //   console.log(d)
  // })
})

onUnmounted(() => {
  // subscription.unsubscribe()
})
</script>
