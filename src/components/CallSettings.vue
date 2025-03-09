<template>
  <section @keydown.esc="close" ref="wrapper" class="call-settings-window-wrapper">
    <button ref="settingsBtn" class="text-4xl rounded-full text-white font-nothing" @click="show">
      Settings
    </button>
    <section ref="settingsWindow" class="call-settings-window hidden bg-blue-700">
      <button
        @click="close"
        ref="closeBtn"
        class="font-nothing absolute p-6 right-0 top-0 text-white text-lg cursor-pointer tracking-[2px]"
      >
        Close [esc]
      </button>
      <div class="settings-item mx-auto max-w-sm mb-8">
        <div class="relative form-control text-white border-2 border-white">
          <label
            class="absolute text-xl translate-x-4 -translate-y-4 bg-blue-700 px-4 font-nothing tracking-[2px]"
            for="username"
            >username</label
          >

          <input
            placeholder="$ -> "
            id="username"
            autocomplete="off"
            name="username"
            type="text"
            class="p-4 text-2xl text-white font-nothing w-full tracking-[2px] focus:ring-0 focus:outline-0"
          />
        </div>
      </div>
      <div class="settings-item mx-auto max-w-sm">
        <div class="relative form-control text-white border-2 border-white">
          <label
            class="absolute text-xl translate-x-4 -translate-y-4 bg-blue-700 px-4 font-nothing tracking-[2px]"
            for="username"
            >username</label
          >

          <input
            id="username"
            autocomplete="off"
            name="username"
            type="text"
            class="p-4 text-2xl text-white font-nothing w-full tracking-[2px] focus:ring-0 focus:outline-0"
          />
        </div>
      </div>

      <!-- <h3 class="text-white text-4xl">Settings</h3> -->
    </section>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import { useCallSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import gsap from 'gsap'
import { useMediaDevices } from '@/composables/useMediaDevices'
const callSettingsStore = useCallSettingsStore()
const { getAudioInputDevices, getUserMedia } = useMediaDevices()
const { closeSettingssettingsWindow } = callSettingsStore
const { visible } = storeToRefs(callSettingsStore)

const settingsWindow = ref(null)
const wrapper = ref(null)
const settingsBtn = ref(null)
const closeBtn = ref(null)

const windowPadding = '40px'
const devices = ref(null)
let tl

onKeyStroke(
  'Escape',
  (e) => {
    e.preventDefault()
    close()
  },
  { dedupe: true },
)

onMounted(async () => {
  // await getUserMedia()
  devices.value = await getAudioInputDevices()

  console.log(devices.value)
})

const close = () => {
  tl.reverse()
}

const show = () => {
  tl = gsap.timeline()
  let windowWidth, windowHeight

  const { innerHeight, innerWidth } = window

  const [wrapperHeight, wrapperWidth] = [innerHeight - 40 * 2, innerWidth - 40 * 2]

  tl.to(wrapper.value, {
    position: 'fixed',
    zIndex: 10,
    duration: 0,
    top: 40,
    left: 40,
    width: wrapperWidth,
    height: wrapperHeight,
  })

  tl.to(settingsWindow.value, {
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    onComplete: () => {
      const windowRects = settingsWindow.value.getClientRects()

      const { width, height } = windowRects[0]

      windowWidth = width
      windowHeight = height
    },
  })

  tl.to(
    settingsBtn.value,
    {
      fontSize: 60,
      padding: 50,
      onComplete: () => {
        settingsWindow.value.style.paddingTop = settingsBtn.value.offsetHeight + 'px'
      },
    },
    '<',
  )

  tl.to(settingsBtn.value, {
    x: () => {
      const buttonRects = settingsBtn.value.getClientRects()[0]
      return windowWidth / 2 - buttonRects.width / 2
    },
  })

  tl.fromTo(
    closeBtn.value,
    {
      opacity: 0,
    },
    { opacity: 1 },
  )

  tl.fromTo(
    '.settings-item',
    {
      opacity: 0,
      y: 100,
      stagger: 0.2,
    },
    { opacity: 1, y: 0, stagger: 0.2 },
    '<',
  )
}
</script>

<style>
.call-settings-window-wrapper {
  /* position: fixed; */
  /* top: v-bind(windowPadding); */
  /* left: v-bind(windowPadding); */
  /* z-index: 10; */
}

.call-settings-window {
  z-index: -1;
}
</style>
