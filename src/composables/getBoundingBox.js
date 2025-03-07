const getBoundingBox = (sketch, facePoints) => {
  let minX = Infinity,
    minY = Infinity
  let maxX = -Infinity,
    maxY = -Infinity

  for (let point of facePoints) {
    minX = sketch.min(minX, point[0])
    minY = sketch.min(minY, point[1])
    maxX = sketch.max(maxX, point[0])
    maxY = sketch.max(maxY, point[1])
  }

  let faceWidth = maxX - minX
  let faceHeight = maxY - minY

  return { minX, minY, maxX, maxY, faceWidth, faceHeight }
}

export { getBoundingBox }
