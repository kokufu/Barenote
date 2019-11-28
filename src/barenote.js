import CONST from "./const"
import Note from './note'

// TODO Move to another file
const ABOUT_DIALOG = '<html><head><title>About</title></head>' +
      '<body style="text-align:center;"><h1>Barenote</h1>' +
      `version ${VERSION}<br />` +
      '<a href="https://github.com/kokufu/Barenote" target="_blank">https://github.com/kokufu/Barenote</a>' +
      '</body></html>';

let isInitialized = false;
function initStyle() {
  if (isInitialized) {
    return;
  }
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerText = CONST.DEFAULT_CSS;
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    head.insertBefore(style, head.firstChild);
  } else {
    document.rootElement.insertBefore(style, document.rootElement.firstChild);
  }
  isInitialized = true;
}

let objectNumber = 0;
export default class Barenote {
  constructor(rootElement) {
    initStyle();

    this._notes = [];
    this._rootElement = rootElement;
    this._objectNumber = objectNumber;
    objectNumber++;

    const refListElement = rootElement.querySelector(CONST.REF_LIST_SELECTOR);
    this._barenoteRefList = document.createElement('ol');
    if (refListElement) {
      refListElement.appendChild(this._barenoteRefList);

      // Add About indicator
      Barenote._setAboutIndicator(refListElement);
    }

    for (const [index, el] of rootElement.querySelectorAll(CONST.REF_SELECTOR).entries()) {
      const note = new Note(this, index, el);
      this._notes.push(note);
    }
    this.enable();
  }

  enable() {
    for (const note of this._notes) {
      const parentEl = note.originalElement.parentElement;
      if (parentEl) {
        // Replace
        parentEl.replaceChild(note.barenoteElement, note.originalElement);

        // Add the text to the reference list
        this._barenoteRefList.appendChild(note.listElement);
      }
    }
  }

  disable() {
    for (const note of this._notes) {
      const parentEl = note.barenoteElement.parentElement;
      if (parentEl) {
        // Revert the number to the original element
        parentEl.replaceChild(note.originalElement, note.barenoteElement);

        // Remove the text to the reference list
        this._barenoteRefList.removeChild(note.listElement);
      }
    }
  }

  get rootElement() {
    return this._rootElement;
  }

  get objectNumber() {
    return this._objectNumber;
  }

  static _setAboutIndicator(element) {
    const aboutIndicatorElement = document.createElement('div');
    aboutIndicatorElement.appendChild(document.createTextNode('?'));
    aboutIndicatorElement.setAttribute('class', CONST.ABOUT_INDICATOR_CLASS);
    aboutIndicatorElement.addEventListener('click', (event) => {
      const aboutWindow = window.open('', '', 'width=500, height=200');
      aboutWindow.document.write(ABOUT_DIALOG);

      // Cancel Event
      event.stopPropagation();
      event.preventDefault();
    });
    element.appendChild(aboutIndicatorElement);
  }
  
  static apply(rootElements) {
    console.warn("Deprecation: Barenote.apply() has been deprecated. use `new Barenote(element)` instead.")
    
    if (!rootElements) {
      rootElements = document.querySelector('body');
    }

    if (typeof rootElements[Symbol.iterator] === 'function') {
      var instances = [];
      for (const el of rootElements) {
        instances.push(new Barenote(el));
      };
      return instances;
    } else {
      return new Barenote(rootElements);
    }
  }
}