const drawAscii = (sketch, capture, options) => {
  // sketch.background(params.background)
  sketch.textSize(options.textSize)
  sketch.fill(options.colour)
  sketch.stroke(255)

  const characters = options.characters.split('')
  capture.value.loadPixels()

  if (capture.value.pixels) {
    for (let y = 0; y < capture.value.height; y += options.pixelSize) {
      for (let x = 0; x < capture.value.width; x += options.pixelSize) {
        // *4 is for each rgba value
        const index = (x + y * capture.value.width) * 4

        const r = capture.value.pixels[index]
        const g = capture.value.pixels[index + 1]
        const b = capture.value.pixels[index + 2]
        // const a = capture.value.pixels[index + 3]

        const bright = Math.round((r + g + b) / 3)

        const letter = characters[Math.round(sketch.map(bright, 0, 255, characters.length - 1, 0))]

        sketch.text(letter, x, y)
      }
    }
  }
}
export { drawAscii }
