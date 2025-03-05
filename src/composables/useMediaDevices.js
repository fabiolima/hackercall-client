import { ref } from 'vue'

const useMediaDevices = () => {
  const loading = ref(false)

  const getDevices = async () => {
    return await navigator.mediaDevices.enumerateDevices()
  }

  const hasMicrophone = async () => {
    const devices = await getDevices()
    return devices.some((device) => device.kind === 'audioinput')
  }

  const hasCamera = async () => {
    const devices = await getDevices()
    return devices.some((device) => device.kind === 'videoinput')
  }

  const getUserMedia = async () => {
    loading.value = true

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: await hasMicrophone(),
      video: await hasCamera(),
    })

    loading.value = false
    return mediaStream
  }

  return {
    loading,
    getUserMedia,
    hasMicrophone,
    hasCamera,
    getDevices,
  }
}

export { useMediaDevices }
