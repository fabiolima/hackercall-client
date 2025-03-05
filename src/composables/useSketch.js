import p5 from 'p5'
import { ref } from 'vue'

const useSketch = () => {
  const capture = ref(null)
  const capturing = ref(false)

  const instance = ref(null)
  const container = ref(null)

  let lastWindowResize = 0
  let currentTime = 0
  const onResizeDebounce = 1000

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

  const fitVideoWidth = () => {
    if (!capture.value) return Promise.resolve({ width: 0, height: 0 })
    return new Promise((resolve) => {
      capture.value.elt.style.width = '100%'
      capture.value.elt.style.height = 'auto'

      setTimeout(() => {
        resolve(capture.value.size())
      }, 0)
    })
  }

  const fitVideoHeight = () => {
    if (!capture.value) return Promise.resolve({ width: 0, height: 0 })
    return new Promise((resolve) => {
      capture.value.elt.style.width = 'auto'
      capture.value.elt.style.height = '100%'

      setTimeout(() => {
        resolve(capture.value.size())
      }, 0)
    })
  }

  const onWindowResize = (sketch) => {
    lastWindowResize = currentTime
    capturing.value = false

    const parentHeight = container.value.clientHeight

    if (capture.value) {
      capture.value.stop()
      capture.value.elt.remove()
    }

    capture.value = sketch.createCapture(constraints, { flipped: true }, async () => {
      capture.value.elt.style.position = 'absolute'
      capture.value.elt.style.visibility = 'hidden'

      let { width, height } = await fitVideoWidth()

      if (height > parentHeight) {
        ;({ width, height } = await fitVideoHeight())
      }

      sketch.resizeCanvas(width, height)

      capture.value.size(width, height)
      capture.value.hide()

      capturing.value = true
    })
  }

  const makeSketch = (sketch) => {
    sketch.setup = () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      sketch.createCanvas(parentWidth, parentHeight)
      onWindowResize(sketch)
    }

    sketch.windowResized = () => {
      currentTime = sketch.millis()

      if (currentTime - lastWindowResize < onResizeDebounce) return

      onWindowResize(sketch)
    }

    sketch.draw = () => {
      sketch.background(params.background)
      sketch.textSize(params.textSize)
      sketch.fill(params.colour)

      const characters = params.characters.split('')

      if (capturing.value) {
        capture.value.loadPixels()

        if (capture.value.pixels) {
          for (let y = 0; y < capture.value.height; y += params.pixelSize) {
            for (let x = 0; x < capture.value.width; x += params.pixelSize) {
              // *4 is for each rgba value
              const index = (x + y * capture.value.width) * 4

              const r = capture.value.pixels[index]
              const g = capture.value.pixels[index + 1]
              const b = capture.value.pixels[index + 2]
              // const a = capture.value.pixels[index + 3]

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
