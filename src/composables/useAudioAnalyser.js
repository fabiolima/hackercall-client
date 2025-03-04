import { ref } from 'vue'

const useAudioAnalyser = () => {
  const averageVolume = ref(0)

  const setupAudioAnalyser = async (stream) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      microphone.connect(analyser)
      analyser.fftSize = 256

      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      function analyse() {
        analyser.getByteFrequencyData(dataArray)

        // Calcula o volume médio do áudio
        averageVolume.value = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength

        requestAnimationFrame(analyse)
      }

      analyse()
    } catch (error) {
      console.error('Erro ao acessar o microfone:', error)
    }
  }

  return { setupAudioAnalyser, averageVolume }
}

export { useAudioAnalyser }
