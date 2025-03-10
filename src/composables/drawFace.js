import { getBoundingBox } from './getBoundingBox'

const drawFace = (sketch, pos) => {
  if (!pos) return

  const { faceWidth, faceHeight, minX, minY } = getBoundingBox(sketch, pos)

  let canvasWidth = sketch.width // Largura do canvas maior
  let canvasHeight = sketch.height // Altura do canvas maior

  let customScale = 2
  // Aplicar o scaling manual
  let scaledFaceWidth = faceWidth * customScale
  let scaledFaceHeight = faceHeight * customScale

  // Calcular a posição centralizada
  let offsetX = (canvasWidth - scaledFaceWidth) / 2
  let offsetY = (canvasHeight - scaledFaceHeight) / 2

  sketch.translate(offsetX, offsetY)
  sketch.scale(customScale)

  for (let i = 0; i < pos.length; i++) {
    let x = pos[i][0] - minX
    let y = pos[i][1] - minY

    sketch.ellipse(x, y, 4, 4)
  }
}

export { drawFace }
