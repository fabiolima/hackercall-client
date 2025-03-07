import p5 from 'p5'
import { ref } from 'vue'
import clm from 'clmtrackr'
import { drawFace } from './drawFace'
import { Observable } from 'rxjs'

const useSketch = () => {
  const capture = ref(null)
  const capturing = ref(false)
  const ctracker = ref(null)
  const instance = ref(null)
  const container = ref(null)
  const canvas = ref(null)
  const canvasStream = ref(null)

  let params = {
    pixelSize: 11,
    colour: [255, 255, 255],
    background: [16, 24, 40],
    characters: ' .:-=+*#%@',
    textSize: 13,
    textStyle: 'NORMAL',
  }

  const constraints = {
    video: true,
    audio: false,
  }

  const newSketch = (canvasContainerId) => {
    container.value = document.getElementById(canvasContainerId)
    instance.value = new p5(makeSketch, canvasContainerId)
  }

  const createFrameObservable = (canvas, fps) => {
    console.log('to aqui')
    return new Observable((subscriber) => {
      console.log('alo1')
      const interval = 1000 / fps // Intervalo entre os frames em milissegundos

      function captureFrame() {
        canvas.elt.toBlob(
          (blob) => {
            subscriber.next(blob) // Emite o frame como Blob
          },
          'image/jpeg',
          1,
        ) // Qualidade de 80%
      }

      const frameInterval = setInterval(captureFrame, interval)

      // Função de limpeza (chamada quando o Observable é cancelado)
      return () => {
        console.log('entrei')
        clearInterval(frameInterval)
      }
    })
  }

  const createCamera = (sketch) => {
    capturing.value = false
    return new Promise((resolve) => {
      const capture = sketch.createCapture(constraints, { flipped: true }, () => {
        capture.elt.style.position = 'absolute'
        capture.elt.style.top = 0
        capture.elt.style.left = 0
        capture.elt.style.zIndex = -10
        capturing.value = true
        capture.hide()
        resolve(capture)
      })
    })
  }

  const makeSketch = (sketch) => {
    sketch.setup = async () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      canvas.value = sketch.createCanvas(parentWidth, parentHeight)
      capture.value = await createCamera(sketch)

      ctracker.value = new clm.tracker()
      ctracker.value.init()
      ctracker.value.start(capture.value.elt)

      canvasStream.value = createFrameObservable(canvas.value, 60)
    }

    sketch.windowResized = () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      sketch.resizeCanvas(parentWidth, parentHeight)
    }

    sketch.draw = () => {
      sketch.background(params.background)

      const pos = ctracker.value?.getCurrentPosition()
      drawFace(sketch, pos)
    }
  }

  return {
    newSketch,
    capture,
    capturing,
    instance,
    canvasStream,
  }
}

export { useSketch }
