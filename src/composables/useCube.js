import { ref } from 'vue'
import p5 from 'p5'
window.p5 = p5
const useCube = () => {
  const container = ref(null)
  const instance = ref(null)
  const canvas = ref(null)
  let angle = 0
  const rotationSpeed = 0.009
  let easyCam
  let angleX = 0,
    angleY = 0,
    angleZ = 0 // Ângulos de rotação
  let sliderX, sliderY, sliderZ // Controles deslizantes

  const start = async (canvasContainer) => {
    const easy = await import('p5.easycam/p5.easycam.js')
    container.value = canvasContainer
    instance.value = new p5(createSketch, container.value)
  }

  const createSketch = (sketch) => {
    sketch.setup = () => setup(sketch)
    sketch.draw = () => draw(sketch)
  }

  const setup = (sketch) => {
    const parentHeight = container.value.clientHeight
    const parentWidth = container.value.clientWidth

    canvas.value = sketch.createCanvas(parentWidth, parentHeight, sketch.WEBGL)
    easyCam = sketch.createEasyCam()
    // easyCam.removeMouseListeners()
    // Cria os controles deslizantes
    sliderX = sketch.createSlider(0, 360, 0) // Slider para o eixo X (0 a 360 graus)
    sliderX.position(20, 20) // Posiciona o slider
    sliderX.style('width', '150px') // Define a largura do slider

    sliderY = sketch.createSlider(0, 360, 0) // Slider para o eixo Y (0 a 360 graus)
    sliderY.position(20, 50) // Posiciona o slider
    sliderY.style('width', '150px') // Define a largura do slider

    sliderZ = sketch.createSlider(0, 360, 0) // Slider para o eixo Z (0 a 360 graus)
    sliderZ.position(20, 80) // Posiciona o slider
    sliderZ.style('width', '150px') // Define a largura do slider
    // easyCam.setState(
    //   {
    //     distance: 300, // Distância da câmera
    //     center: [0, 0, 0], // Centro da cena
    //     rotation: [0, 0, 0, 1], // Rotação da câmera (quaternion)
    //   },
    //   0,
    // ) // Duração da animação (0 para instantâneo)
    //
    // sketch.perspective(sketch.PI / 3, sketch.width / sketch.height, 0.1, 5000) // Ajusta a perspectiva

    // sketch.background(25)
    //
    // easyCam.rotate(sketch.PI)
  }

  const draw = (sketch) => {
    sketch.background(0)

    angle += rotationSpeed * (sketch.deltaTime / 16.67) // normaliza o FPS
    angle = angle % (2 * sketch.PI) // mantém o angulo entre 0 a 2 PI
    angleX = sketch.radians(sliderX.value()) // Converte o valor do slider para radianos
    angleY = sketch.radians(sliderY.value()) // Converte o valor do slider para radianos
    angleZ = sketch.radians(sliderZ.value()) // Converte o valor do slider para radianos

    sketch.push()
    // Aplica a rotação ao cubo
    // sketch.rotateX(180)
    // sketch.rotateX(10)
    //
    sketch.rotateX(angleX) // Rotação no eixo X
    sketch.rotateY(angle)
    sketch.rotateZ(sketch.PI / 4)
    // sketch.rotateZ(sketch.PI / 4)
    // sketch.rotateY(angle)
    // easyCam.rotateY(45) // Rotação no eixo Y
    // sketch.lights()
    // sketch.noFill()
    // sketch.stroke(255)
    const box = sketch.box(100)
    sketch.pop()
  }

  return { start }
}

export { useCube }
