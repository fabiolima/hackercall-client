const useSketch = (sketch) => {
  let x = 100
  let y = 100
  let capture
  let capturing

  let params = {
    pixelSize: 10,
    colour: [255, 255, 255],
    background: [0, 0, 0],
    characters: ' .:-=+*#%@',
    textSize: 13,
    textStyle: 'NORMAL',
  }

  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight)

    const constraints = {
      video: {
        // mandatory: {
        //   minWidth: 1280,
        //   minHeight: 720,
        // },
        // optional: [{ maxFrameRate: 10 }],
      },
      audio: false,
    }

    capture = sketch.createCapture(constraints, function () {
      capturing = true
      console.log('capturing')
    })

    capture.size(sketch.windowWidth, sketch.windowHeight)
    capture.hide()
  }

  sketch.draw = () => {
    sketch.background(params.background)

    sketch.textSize(params.textSize)
    sketch.fill(params.colour)
    const characters = params.characters.split('')

    if (capturing) {
      capture.loadPixels()

      if (capture.pixels) {
        for (y = 0; y < capture.height; y += params.pixelSize) {
          for (x = 0; x < capture.width; x += params.pixelSize) {
            // *4 is for each rgba value
            const index = (x + y * capture.width) * 4

            const r = capture.pixels[index]
            const g = capture.pixels[index + 1]
            const b = capture.pixels[index + 2]
            const a = capture.pixels[index + 3]

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

export { useSketch }
