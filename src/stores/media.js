import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useMediaDevices } from '@/composables/useMediaDevices'
const { getUserMedia } = useMediaDevices()

export const useMediaStore = defineStore('media', () => {
  const state = ref({
    loading: false,
    completed: false,
    error: false,
    errorName: '',
    errorMessage: '',
  })

  const stream = ref(null)

  const requestAudioInput = async () => {
    state.value.completed = false
    state.value.loading = true

    try {
      stream.value = await getUserMedia({ audio: true })
    } catch (err) {
      state.value.error = true
      state.value.errorName = err.name
      state.value.errorMessage = err.message

      console.log(err)
    } finally {
      state.value.loading = false
      state.value.completed = true
    }
  }

  return { state, stream, requestAudioInput }
})
