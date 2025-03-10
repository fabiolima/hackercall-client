import p5 from 'p5'
import { ref } from 'vue'
import clm from 'clmtrackr'
import { drawFace } from './drawFace'
import { Observable, BehaviorSubject } from 'rxjs'

const usePeerSketch = () => {
  const container = ref(null)
  const canvas = ref(null)
  const instance = ref(null)
  let facePositionsObservable = null
  const behaviorSubject$ = new BehaviorSubject(null)

  let facePoints = ref(null)

  const newPeerSketch = (canvasContainerId, observable) => {
    container.value = document.getElementById(canvasContainerId)
    instance.value = new p5(makeSketch, canvasContainerId)

    observable.subscribe((points) => {
      facePoints.value = points
      if (!points) {
        console.log('to nulo')
      }
    })
    // facePositionsObservable = observable
    // behaviorSubject$.subscribe(facePositionsObservable)
  }

  const makeSketch = (sketch) => {
    sketch.setup = async () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      canvas.value = sketch.createCanvas(parentWidth, parentHeight)
    }

    sketch.windowResized = () => {
      const parentHeight = container.value.clientHeight
      const parentWidth = container.value.clientWidth

      sketch.resizeCanvas(parentWidth, parentHeight)
    }

    sketch.draw = () => {
      sketch.background([16, 24, 40])

      // const facePoints = behaviorSubject$.getValue()
      drawFace(sketch, facePoints.value)
    }
  }

  return {
    newPeerSketch,
  }
}

export { usePeerSketch }
