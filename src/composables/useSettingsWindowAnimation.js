import gsap from 'gsap'
import { ref } from 'vue'

const constrain = function (n, low, high) {
  return Math.max(Math.min(n, high), low)
}

const map = (n, start1, stop1, start2, stop2, withinBounds) => {
  const newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
  if (!withinBounds) {
    return newval
  }

  if (start2 < stop2) {
    return constrain(newval, start2, stop2)
  } else {
    return constrain(newval, stop2, start2)
  }
}

const useSettingsWindowAnimation = ({ settingsWindow }) => {
  const animation = ref(null)

  const show = (onCompleteHandler) => {
    // if (animation.value) return animation.value.play()

    const tl = gsap.timeline()

    settingsWindow.value.style.maxWidth = '800px'
    settingsWindow.value.style.maxHeight = '600px'

    tl.to(settingsWindow.value, {
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '50%',
      left: '50%',
      yPercent: -50,
      xPercent: -50,
      duration: 0,
      scale: 0,
    })

    tl.to(settingsWindow.value, {
      duration: 0.5,
      scale: 1,
    })

    tl.fromTo(
      '.settings-item',
      {
        opacity: 0,
        y: 100,
        stagger: 0.2,
      },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.2 },
      '<',
    )

    tl.then(onCompleteHandler)
    animation.value = tl
  }

  const close = (onCompleteHandler) => {
    animation.value.reverse().then(onCompleteHandler)
  }

  return {
    show,
    close,
  }
}

export { useSettingsWindowAnimation }
