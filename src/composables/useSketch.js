import p5 from 'p5'
import { ref } from 'vue'

const useSketch = () => {
  let x = 100
  let y = 100
  const capture = ref(null)
  const capturing = ref(false)

  let params = {
    pixelSize: 10,
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

  let lastWindowResize = 0
  let currentTime = 0
  const onResizeDebounce = 1000

  const instance = ref(null)
  const container = ref(null)

  const newSketch = (canvasContainerId) => {
    container.value = document.getElementById(canvasContainerId)
    console.log(container.value)
    instance.value = new p5(makeSketch, canvasContainerId)
  }

  const makeSketch = (sketch) => {
    const onWindowResize = () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      if (capture.value) {
        capture.value.stop()
        capture.value.elt.remove()
      }

      capture.value = sketch.createCapture(constraints, function () {
        capture.value.elt.style.width = '100%'
        capture.value.elt.style.height = 'auto'
        capture.value.elt.style.position = 'absolute'
        capture.value.elt.style.visibility = 'hidden'
        // debugger

        setTimeout(() => {
          console.log('capturing')
          const { width, height } = capture.value.size()
          const newWidth = (width * parentHeight) / height

          // capture.value.size(newWidth, parentHeight)
          sketch.resizeCanvas(width, height)
          capture.value.size(width, height)

          // capture.value.hide()

          capturing.value = true
        }, 0)
      })
      // debugger
    }

    sketch.setup = () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      const canvas = sketch.createCanvas(parentWidth, parentHeight)
      onWindowResize()
    }

    sketch.windowResized = () => {
      currentTime = sketch.millis()

      if (currentTime - lastWindowResize < onResizeDebounce) return

      // @TODO fazer o calculo da inversão de proporcao
      // quando o video for maior que o container, inverter para height 100% e width auto

      capturing.value = false
      onWindowResize()
      lastWindowResize = currentTime
    }

    sketch.draw = () => {
      sketch.background(params.background)

      sketch.textSize(params.textSize)
      sketch.fill(params.colour)
      const characters = params.characters.split('')

      if (capturing.value) {
        capture.value.loadPixels()
        // console.log(capture.value.size())
        // console.log(capture.value.width, capture.value.height)

        if (capture.value.pixels) {
          for (y = 0; y < capture.value.height; y += params.pixelSize) {
            for (x = 0; x < capture.value.width; x += params.pixelSize) {
              // *4 is for each rgba value
              const index = (x + y * capture.value.width) * 4

              const r = capture.value.pixels[index]
              const g = capture.value.pixels[index + 1]
              const b = capture.value.pixels[index + 2]
              const a = capture.value.pixels[index + 3]

              const bright = Math.round((r + g + b) / 3)

              const letter =
                characters[Math.round(sketch.map(bright, 0, 255, characters.length - 1, 0))]

              sketch.text(letter, x, y)
            }
          }
        }
      }
    }
  }

  return {
    newSketch,
    capture,
    capturing,
    instance,
  }
}

export { useSketch }
