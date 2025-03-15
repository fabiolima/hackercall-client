import gsap from 'gsap'
import { ref } from 'vue'

const useSettingsWindowAnimation = ({ settingsWindow, closeBtn }) => {
  const animation = ref(null)

  const show = () => {
    if (animation.value) return animation.value.play()

    const tl = gsap.timeline()

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
      scale: 1,
    })

    tl.fromTo(
      closeBtn.value,
      {
        opacity: 0,
      },
      { opacity: 1 },
    )

    tl.fromTo(
      '.settings-item',
      {
        opacity: 0,
        y: 100,
        stagger: 0.2,
      },
      { opacity: 1, y: 0, stagger: 0.2 },
      '<',
    )
    animation.value = tl
  }

  const close = () => {
    animation.value.reverse()
  }

  return {
    show,
    close,
  }
}

export { useSettingsWindowAnimation }
