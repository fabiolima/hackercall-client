import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAudioAnalyser } from './useAudioAnalyser'
import p5 from 'p5'
import IcelandRegular from '@/assets/fonts/Iceland-Regular.ttf'

window.p5 = p5

const useCube = () => {
  const container = ref(null)
  const instance = ref(null)
  const canvas = ref(null)
  let userSettings
  let font

  const rotationSpeed = 0.009
  let angle = 0

  let boxSize = 100
  let boxColor
  let currentColor

  const audioAnalyser = useAudioAnalyser()
  const { averageVolume } = storeToRefs(audioAnalyser)

  const start = async ({ container: canvasContainer, stream, settings }) => {
    await import('p5.easycam/p5.easycam.js')
    container.value = canvasContainer
    instance.value = new p5(createSketch, container.value)
    userSettings = settings

    audioAnalyser.setupAudioAnalyser(stream)
  }

  const fitCanvas = () => {
    const parentHeight = container.value.clientHeight
    const parentWidth = container.value.clientWidth
    instance.value.resizeCanvas(parentWidth, parentHeight)
  }

  const createSketch = (sketch) => {
    sketch.setup = () => setup(sketch)
    sketch.draw = () => draw(sketch)
    sketch.preload = () => preload(sketch)
    sketch.windowResized = () => {
      setTimeout(() => {
        const parentHeight = container.value.clientHeight
        const parentWidth = container.value.clientWidth

        sketch.resizeCanvas(parentWidth, parentHeight)
      })
    }
  }

  const setup = (sketch) => {
    const parentHeight = container.value.clientHeight
    const parentWidth = container.value.clientWidth

    canvas.value = sketch.createCanvas(parentWidth, parentHeight, sketch.WEBGL)
    const easycam = sketch.createEasyCam()

    easycam.removeMouseListeners()

    currentColor = sketch.color(255)
  }

  const preload = (sketch) => {
    font = sketch.loadFont(IcelandRegular)
  }

  const getBoxSize = (sketch) => {
    const { width } = sketch

    const constrainWidth = sketch.constrain(width, 0, 1024)

    const initial = sketch.map(constrainWidth, 0, 1024, 50, 100)

    const target = sketch.map(averageVolume.value, 0, 100, initial, initial * 2)

    return { initial, target }
  }

  const getTextSize = (sketch) => {
    const { width } = sketch
    const constrainWidth = sketch.constrain(width, 0, 1024)

    return sketch.map(constrainWidth, 0, 1024, 14, 26)
  }

  const draw = (sketch) => {
    sketch.background('#0a0a0a')

    angle += rotationSpeed * (sketch.deltaTime / 16.67) // normaliza o FPS
    angle = angle % (2 * sketch.PI) // mantém o angulo entre 0 a 2 PI

    sketch.push()

    if (averageVolume.value > 10) {
      boxColor = sketch.color(0, 255, 0)
    } else {
      boxColor = sketch.color(userSettings.value.color)
    }

    const { initial, target } = getBoxSize(sketch)
    boxSize = sketch.lerp(boxSize, target, 0.1)

    // Suaviza a transição da cor
    let r = sketch.lerp(sketch.red(currentColor), sketch.red(boxColor), 0.1)
    let g = sketch.lerp(sketch.green(currentColor), sketch.green(boxColor), 0.1)
    let b = sketch.lerp(sketch.blue(currentColor), sketch.blue(boxColor), 0.1)
    currentColor = sketch.color(r, g, b)

    sketch.rotateY(angle)
    sketch.rotateZ(sketch.PI / 4)
    sketch.fill(currentColor)
    sketch.box(boxSize)

    sketch.pop()

    sketch.textFont(font)
    sketch.fill(255)
    sketch.textSize(getTextSize(sketch))
    sketch.textAlign(sketch.CENTER)
    sketch.text(userSettings.value.username, 0, initial + 30)
  }

  return { start, fitCanvas }
}

export { useCube }
