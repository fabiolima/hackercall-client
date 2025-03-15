import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateUsername } from 'unique-username-generator'

const getInitialState = () => {
  const savedData = localStorage.getItem('hackercall::settings')

  try {
    const settings = savedData ? JSON.parse(savedData) : {}

    settings.username = settings.username || generateUsername()
    return settings
  } catch {
    return {
      username: generateUsername(),
      rememberMe: true,
    }
  }
}

const useCallSettingsStore = defineStore('settings', () => {
  const visible = ref(false)
  const settings = ref(getInitialState())

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
    settings,
  }
})

export { useCallSettingsStore }
