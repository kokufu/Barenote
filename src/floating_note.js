'use strict'

import CONST from "./const"

let instance = document.querySelector(CONST.FLOATING_NOTE_SELECTOR)
if (!instance) {
  instance = document.createElement('div')
  instance.setAttribute('id', CONST.FLOATING_NOTE_ID)
  instance.style.cssText = 'position: absolute !important;'
  instance.hidden = true
  document.body.appendChild(instance)

  const originalOpacity = (instance.style.opacity) ? instance.style.opacity : 1.0
  instance.show = (event) => {
    const rect = event.data.element.getBoundingClientRect()
    let left = rect.left + rect.width + window.pageXOffset
    const top = rect.top + rect.height + window.pageYOffset

    // TODO: measure actual instance size instead of 420px
    if (left + 420 > window.innerWidth) {
        left = window.innerWidth - 420
    }

    instance.isAnimating = false

    instance.innerHTML = event.data.text

    instance.style.left = `${left}px`
    instance.style.top = `${top}px`
    instance.style.opacity = originalOpacity
    instance.hidden = false
  }

  instance.hide = () => {
    const delay = 500 // 0.5 sec
    const start = window.performance.now()
    const duration = 1000 // 1 sec

    instance.isAnimating = true
    window.requestAnimationFrame(function fadeOut(now) {
      if (!instance.isAnimating) {
        return
      }
      const progress = now - start - delay
      if (progress < 0) {
        window.requestAnimationFrame(fadeOut)
        return
      }
      let opacity = originalOpacity * (1 - progress / duration)
      opacity = (opacity < 0) ? 0 : opacity
      instance.style.opacity = opacity

      if (progress < duration) {
        window.requestAnimationFrame(fadeOut)
      } else {
        instance.hidden = true
        instance.isAnimating = false
      }
    })
  }
}

export default instance
