import gsap from 'gsap'
import { ref } from 'vue'

const useSettingsWindowAnimation = ({ wrapper, settingsWindow, settingsBtn, closeBtn }) => {
  const animation = ref(null)

  const show = () => {
    if (animation.value) return animation.value.play()

    const tl = gsap.timeline()

    let windowWidth, windowHeight
    const padding = 40

    const { innerHeight, innerWidth } = window

    const [wrapperHeight, wrapperWidth] = [innerHeight - padding * 2, innerWidth - padding * 2]

    tl.to(wrapper.value, {
      position: 'fixed',
      zIndex: 10,
      duration: 0,
      top: padding,
      left: padding,
      width: wrapperWidth,
      height: wrapperHeight,
    })

    tl.to(settingsWindow.value, {
      zIndex: -1,
      display: 'block',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      onComplete: () => {
        const windowRects = settingsWindow.value.getClientRects()
        const { width, height } = windowRects[0]

        windowWidth = width
        windowHeight = height
      },
    })

    tl.to(
      settingsBtn.value,
      {
        fontSize: 60,
        padding: 50,
        onComplete: () => {
          settingsWindow.value.style.paddingTop = settingsBtn.value.offsetHeight + 'px'
        },
      },
      '<',
    )

    tl.to(settingsBtn.value, {
      x: () => {
        const buttonRects = settingsBtn.value.getClientRects()[0]
        return windowWidth / 2 - buttonRects.width / 2
      },
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
