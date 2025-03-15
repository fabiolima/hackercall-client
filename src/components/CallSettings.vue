<template>
  <section @keydown.esc="closeSettingsWindow" ref="wrapper" class="call-settings-window-wrapper">
    <button
      ref="settingsBtn"
      class="text-4xl rounded-full text-white font-iceland"
      @click="showSettingsWindow"
    >
      Settings
    </button>
    <section ref="settingsWindow" class="call-settings-window hidden bg-blue-700">
      <button
        @click="closeSettingsWindow"
        ref="closeBtn"
        class="font-iceland absolute p-6 right-0 top-0 text-white text-lg cursor-pointer tracking-[2px]"
      >
        Close [esc]
      </button>
      <div class="settings-item mx-auto max-w-sm mb-8">
        <div class="relative form-control text-white border-2 border-white">
          <label
            class="absolute text-xl translate-x-4 -translate-y-4 bg-blue-700 px-4 font-iceland tracking-[2px]"
            for="username"
            >username</label
          >

          <input
            placeholder="$ -> "
            id="username"
            autocomplete="off"
            name="username"
            type="text"
            class="p-4 text-2xl text-white font-iceland w-full tracking-[2px] focus:ring-0 focus:outline-0"
          />
        </div>
      </div>
      <div class="settings-item mx-auto max-w-sm">
        <div class="relative form-control text-white border-2 border-white">
          <label
            class="absolute text-xl translate-x-4 -translate-y-4 bg-blue-700 px-4 font-iceland tracking-[2px]"
            for="username"
            >username</label
          >

          <input
            id="username"
            autocomplete="off"
            name="username"
            type="text"
            class="p-4 text-2xl text-white font-iceland w-full tracking-[2px] focus:ring-0 focus:outline-0"
          />
        </div>
      </div>

      <!-- <h3 class="text-white text-4xl">Settings</h3> -->
    </section>
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
const { getAudioInputDevices, getUserMedia } = useMediaDevices()
const { showSettingsWindow, closeSettingsWindow } = callSettingsStore
const { visible } = storeToRefs(callSettingsStore)

const settingsWindow = ref(null)
const wrapper = ref(null)
const settingsBtn = ref(null)
const closeBtn = ref(null)

const devices = ref(null)

const { show, close } = useSettingsWindowAnimation({
  wrapper,
  settingsWindow,
  settingsBtn,
  closeBtn,
})

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
  isVisible ? show() : close()
})
</script>
