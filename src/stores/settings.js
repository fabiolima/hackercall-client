import { defineStore } from 'pinia'
import { ref } from 'vue'

const useCallSettingsStore = defineStore('settings', () => {
  const visible = ref(false)

  const toggleSettingsWindow = () => {
    visible.value = !visible.value
  }

  const showSettingsWindow = () => {
    visible.value = true
  }

  const closeSettingsWindow = () => {
    visible.value = false
  }
  return {
    toggleSettingsWindow,
    showSettingsWindow,
    closeSettingsWindow,
    visible,
  }
})

export { useCallSettingsStore }
