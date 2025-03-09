<template>
  <div
    ref="loadingWindow"
    class="z-100 absolute top-0 left-0 bg-blue-700 h-full w-full flex items-center justify-center"
  >
    <h1 class="text-2xl text-white font-nothing">Loading...</h1>
  </div>

  <div ref="appWindow" class="-translate-y-full h-full w-full">
    <CallView v-if="!isLoading" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useMediaStore } from '@/stores/media'
import { usePeerStore } from '@/stores/peer'
import { storeToRefs } from 'pinia'
import CallView from './views/CallView.vue'
import gsap from 'gsap'

const mediaStore = useMediaStore()
const peerStore = usePeerStore()

const { requestAudioInput } = mediaStore
const { startMyPeer } = peerStore

const { state: peerState } = storeToRefs(peerStore)
const { state: mediaState } = storeToRefs(mediaStore)

const loadingWindow = ref(null)
const appWindow = ref(null)

onMounted(async () => {
  // await requestAudioInput()
  await startMyPeer()

  console.log(peerState.value)
})

const isLoading = computed(() => {
  return (
    // !mediaState.value.completed ||
    // mediaState.value.loading ||
    !peerState.value.completed || peerState.value.loading
  )
})

const closeLoadingWindow = () => {
  const tl = gsap.timeline()

  tl.to(loadingWindow.value, {
    zIndex: 100,
    xPercent: -100,
    display: 'none',
    duration: 1,
    ease: 'power2.out',
  })

  tl.to(appWindow.value, {
    yPercent: 100,
  })
}

watch(isLoading, (val, oldVal) => {
  if (oldVal && !val) {
    closeLoadingWindow()
  }
})
</script>

<style scoped>
/* Animação de slide-in */
/* .slide-in-enter-active, */
/* .slide-in-leave-active { */
/*   transition: transform 0.5s ease; */
/* } */
/**/
/* .slide-in-enter-from, */
/* .slide-in-leave-to { */
/*   transform: translateX(100%); */
/* } */
/**/
/* .slide-in-enter-to, */
/* .slide-in-leave-from { */
/*   transform: translateX(0); */
/* } */

/* Animação de slide-out */
.slide-in-enter-from {
  transform: translateX(-100%);
}

.slide-in-enter-active {
  transition: transform 0.3s ease-in;
}

.slide-in-enter-to {
  transform: translateX(0);
}

/* .slide-in-leave-from { */
/*   transform: translateX(0); */
/* } */
/**/
/* .slide-in-leave-active { */
/*   transition: transform 0.3s ease-in; */
/* } */
/**/
/* .slide-in-leave-to { */
/*   transform: translateX(-100%); */
/* } */

.slide-out-enter-to {
  transform: translateX(0);
}

.slide-out-leave-from {
  transform: translateX(0);
}

.slide-out-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-out-leave-to {
  transform: translateX(-100%);
}
/**/
/* .slide-out-enter-active, */
/* .slide-out-leave-active { */
/*   transition: transform 0.5s ease; */
/* } */
/**/
/* .slide-out-enter-from, */
/* .slide-out-leave-to { */
/* } */
/**/
/* .slide-out-enter-to, */
/* .slide-out-leave-from { */
/*   transform: translateX(-100%); */
/* } */
</style>
