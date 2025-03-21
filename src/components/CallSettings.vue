<template>
  <section
    ref="settingsWindow"
    class="call-settings-window hidden bg-blue-700 border-2 border-white"
  >
    <div class="w-full border-b-2 border-white flex mb-12">
      <h3 class="text-xl font-iceland grow-1 bg-white m-2 text-blue-700 pl-4">Settings</h3>
      <button
        @click="closeSettingsWindow"
        ref="closeBtn"
        class="font-iceland text-blue-700 bg-white m-2 px-2 text-lg cursor-pointer"
      >
        [esc] close
      </button>
    </div>

    <div class="settings-item mx-auto max-w-sm mb-8">
      <div class="relative form-control text-white border-2 border-white">
        <label
          class="absolute text-2xl translate-x-4 -translate-y-4 bg-blue-700 px-4 font-iceland"
          for="username"
          >username</label
        >

        <input
          ref="usernameInput"
          v-model="settings.username"
          placeholder="$ -> "
          id="username"
          autocomplete="off"
          name="username"
          type="text"
          class="p-4 text-2xl text-white font-iceland w-full focus:ring-0 focus:outline-0"
        />
      </div>
    </div>

    <div
      class="settings-item mx-auto max-w-sm mb-8 border-2 border-white relative pt-5 pb-4 px-4 flex flex-wrap gap-2"
    >
      <label
        class="absolute top-0 left-0 text-white text-2xl translate-x-4 -translate-y-4 bg-blue-700 px-4 font-iceland"
      >
        cube color
      </label>

      <label
        v-for="color in colorOptions"
        :key="color"
        :for="`color-${color}`"
        class="h-12 w-12 inline-block cursor-pointer"
        :class="settings.color == color && 'border-2 border-white '"
        :style="{ backgroundColor: color, content: '' }"
      >
        <input
          v-model="settings.color"
          type="radio"
          name="color"
          class="invisible w-0 h-0"
          :value="color"
          :id="`color-${color}`"
        />
      </label>
    </div>

    <div class="settings-item mx-auto max-w-sm mb-8">
      <div class="flex items-center">
        <input v-model="settings.rememberMe" type="checkbox" class="" id="save" />

        <label for="save" class="ml-4 text-white text-2xl font-iceland">
          remember my settings
        </label>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useCallSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { useMediaDevices } from '@/composables/useMediaDevices'
import { useSettingsWindowAnimation } from '@/composables/useSettingsWindowAnimation'

const callSettingsStore = useCallSettingsStore()
const { closeSettingsWindow } = callSettingsStore
const { visible, settings } = storeToRefs(callSettingsStore)

const { getAudioInputDevices } = useMediaDevices()

const settingsWindow = ref(null)
const closeBtn = ref(null)
const devices = ref(null)
const usernameInput = ref(null)

const { show, close } = useSettingsWindowAnimation({
  settingsWindow,
  closeBtn,
})

const colorOptions = [
  '#ffffff',
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#10b981', // emerald
  '#0ea5e9', // sky
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#e11d48', // rose
  '#6b7280', // gray
  '#78716c', // stone
]

onKeyStroke(
  'Escape',
  (e) => {
    e.preventDefault()
    closeSettingsWindow()
  },
  { dedupe: true },
)

onMounted(async () => {
  devices.value = await getAudioInputDevices()
})

watch(visible, (isVisible) => {
  isVisible ? show(() => usernameInput.value.focus()) : close(() => usernameInput.value.blur())
})
</script>
