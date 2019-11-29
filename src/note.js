'use strict'

import CONST from './const'
import floatingNote from './floating_note'

function makeBarenoteElement(note) {
    let inTouch = false
    const barenoteElement = document.createElement('a')
    barenoteElement.innerText = `${note.index + 1}`
    barenoteElement.setAttribute('id', `fnref:${note.reference}`)
    barenoteElement.setAttribute('href', `#fn:${note.reference}`)
    barenoteElement.setAttribute('class', CONST.REF_CLASS)
    barenoteElement.addEventListener('touchstart', (event) => {
        event.data = { element: barenoteElement, text: note.originalElement.innerHTML }
        floatingNote.show(event)
        inTouch = true
    })
    barenoteElement.addEventListener('touchend', (event) => {
        floatingNote.hide()
        // To prevent "click" and "mouseover" events, delay to disable the flag
        setTimeout(() => {
            inTouch = false
        }, 500)
    })
    barenoteElement.addEventListener('mouseover', (event) => {
        if (inTouch) {
            return
        }
        event.data = { element: barenoteElement, text: note.originalElement.innerHTML }
        floatingNote.show(event)
    })
    barenoteElement.addEventListener('mouseout', (event) => {
        floatingNote.hide()
    })
    barenoteElement.addEventListener('click', (event) => {
        if (!inTouch) {
            note.listElement.scrollToOwnTop()
        }

        // Cancel Event
        event.stopPropagation()
        event.preventDefault()
    })
    barenoteElement.scrollToOwnTop = scrollToOwnTop
    return barenoteElement
}

function makeListElement(note) {
    const arrowElement = document.createElement('a')
    arrowElement.setAttribute('href', `#fnref:${note.reference}`)
    arrowElement.innerHTML = '&#8617;'
    arrowElement.addEventListener('click', (event) => {
        note.barenoteElement.scrollToOwnTop()

        // Cancel Event
        event.stopPropagation()
        event.preventDefault()
    })
    const listElement = document.createElement('li')
    listElement.setAttribute('id', `fn:${note.reference}`)
    listElement.innerHTML = `${note.originalElement.innerHTML}&nbsp;`
    listElement.appendChild(arrowElement)
    listElement.scrollToOwnTop = scrollToOwnTop
    return listElement
}

function scrollToOwnTop() {
    const startX = window.scrollX
    const startY = window.scrollY
    const rect = this.getBoundingClientRect()
    const endY = rect.top + window.pageYOffset
    const startTime = window.performance.now()
    const duration = 200 // 0.2 sec

    window.requestAnimationFrame(function scrollTo(now) {
        let ratio = (now - startTime) / duration
        ratio = (ratio > 1.0) ? 1.0 : ratio
        const y = startY + (endY - startY) * ratio
        window.scrollTo(startX, y)

        if (ratio != 1.0) {
            window.requestAnimationFrame(scrollTo)
        }
    })
}

export default class Note {
    constructor(parent, index, originalElement) {
        const reference = `${parent.objectNumber}_${index}`
        Object.defineProperties(this, {
            index: {
                get() { return index }
            },
            reference: {
                get() { return reference }
            },
            originalElement: {
                get() { return originalElement }
            }
        })
        const barenoteElement = makeBarenoteElement(this)
        const listElement = makeListElement(this)
        Object.defineProperties(this, {
            barenoteElement: {
                get() { return barenoteElement }
            },
            listElement: {
                get() { return listElement }
            }
        })
    }
}
