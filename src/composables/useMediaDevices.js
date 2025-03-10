import { ref } from 'vue'

const useMediaDevices = () => {
  const loading = ref(false)

  const getDevices = async () => {
    return await navigator.mediaDevices.enumerateDevices()
  }

  const getAudioInputDevices = async () => {
    const devices = await getDevices()
    return devices.filter((d) => d.kind === 'audioinput')
  }

  const hasMicrophone = async () => {
    const devices = await getDevices()
    return devices.some((device) => device.kind === 'audioinput')
  }

  const hasCamera = async () => {
    const devices = await getDevices()
    return devices.some((device) => device.kind === 'videoinput')
  }

  const getUserMedia = async (opts) => {
    return navigator.mediaDevices.getUserMedia({
      audio: opts.audio || false,
      video: opts.video || false,
    })
  }

  return {
    getAudioInputDevices,
    loading,
    getUserMedia,
    hasMicrophone,
    hasCamera,
    getDevices,
  }
}

export { useMediaDevices }
