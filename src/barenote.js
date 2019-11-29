'use strict'

import CONST from './const'
import Note from './note'

let isInitialized = false
function initStyle() {
  if (isInitialized) {
    return
  }
  const style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  style.innerText = CONST.DEFAULT_CSS
  let head = document.getElementsByTagName('head')[0]
  if (head) {
    head.insertBefore(style, head.firstChild)
  } else {
    document.rootElement.insertBefore(style, document.rootElement.firstChild)
  }
  isInitialized = true
}

function setAboutIndicator(element) {
  const ABOUT_DIALOG = require('./about.html')
  const aboutIndicatorElement = document.createElement('div')
  aboutIndicatorElement.appendChild(document.createTextNode('?'))
  aboutIndicatorElement.setAttribute('class', CONST.ABOUT_INDICATOR_CLASS)
  aboutIndicatorElement.addEventListener('click', (event) => {
    const aboutWindow = window.open('', '', 'width=500, height=200')
    aboutWindow.document.write(ABOUT_DIALOG)

    // Cancel Event
    event.stopPropagation()
    event.preventDefault()
  })
  element.appendChild(aboutIndicatorElement)
}

let objectNumber = 0
export default class Barenote {
  constructor(rootElement) {
    initStyle()

    const notes = []
    const myObjectNumber = objectNumber
    objectNumber++

    const refListElement = rootElement.querySelector(CONST.REF_LIST_SELECTOR)
    const barenoteRefList = document.createElement('ol')
    if (refListElement) {
      refListElement.appendChild(barenoteRefList)

      // Add About indicator
      setAboutIndicator(refListElement)
    }

    for (const [index, el] of rootElement.querySelectorAll(CONST.REF_SELECTOR).entries()) {
      const note = new Note(this, index, el)
      notes.push(note)
    }

    this.enable = () => {
      for (const note of notes) {
        const parentEl = note.originalElement.parentElement
        if (parentEl) {
          // Replace
          parentEl.replaceChild(note.barenoteElement, note.originalElement)
  
          // Add the text to the reference list
          barenoteRefList.appendChild(note.listElement)
        }
      }
    }

    this.disable = () => {
      for (const note of notes) {
        const parentEl = note.barenoteElement.parentElement
        if (parentEl) {
          // Revert the number to the original element
          parentEl.replaceChild(note.originalElement, note.barenoteElement)
  
          // Remove the text to the reference list
          barenoteRefList.removeChild(note.listElement)
        }
      }
    }

    Object.defineProperties(this, {
      rootElement: {
        get() { return rootElement }
      },
      objectNumber: {
        get() { return myObjectNumber }
      }
    })

    this.enable()
  }

  static apply(rootElements) {
    console.warn("Deprecation: Barenote.apply() has been deprecated. use `new Barenote(element)` instead.")
    
    if (!rootElements) {
      rootElements = document.querySelector('body')
    }

    if (typeof rootElements[Symbol.iterator] === 'function') {
      var instances = []
      for (const el of rootElements) {
        instances.push(new Barenote(el))
      }
      return instances
    } else {
      return new Barenote(rootElements)
    }
  }
}