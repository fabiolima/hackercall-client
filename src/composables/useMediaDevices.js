const useMediaDevices = () => {
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
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: await hasMicrophone(),
      video: await hasCamera(),
    })

    return mediaStream
  }

  return {
    getUserMedia,
    hasMicrophone,
    hasCamera,
    getDevices,
  }
}

export { useMediaDevices }
