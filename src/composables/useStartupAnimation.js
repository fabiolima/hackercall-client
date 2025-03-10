import { computed, watch } from 'vue'
import { usePeerStore } from '@/stores/peer'
import { useMediaStore } from '@/stores/media'
import gsap from 'gsap'
import { storeToRefs } from 'pinia'

const useStartupAnimation = ({ appWindow, loadingWindow }) => {
  const [peerStore, mediaStore] = [usePeerStore(), useMediaStore()]
  const { state: mediaState } = storeToRefs(mediaStore)
  const { state: peerState } = storeToRefs(peerStore)

  const isLoading = computed(() => {
    return (
      !mediaState.value.completed ||
      mediaState.value.loading ||
      !peerState.value.completed ||
      peerState.value.loading
    )
  })

  const doTransition = () => {
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
    if (!val && oldVal) {
      doTransition()
    }
  })
}

export { useStartupAnimation }
