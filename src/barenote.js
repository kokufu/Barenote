const REF_CLASS = 'barenote';
const REF_SELECTOR = '.' + REF_CLASS;
const REF_LIST_CLASS = 'barenote_ref_list';
const REF_LIST_SELECTOR = '.' + REF_LIST_CLASS;
const FLOATING_NOTE_ID = 'barenote_floating_note';
const FLOATING_NOTE_SELECTOR = '#' + FLOATING_NOTE_ID;
const ABOUT_INDICATOR_CLASS = 'barenote_about_indicator';
const ABOUT_INDICATOR_SELECTOR = '.' + ABOUT_INDICATOR_CLASS;
const DEFAULT_CSS =
      FLOATING_NOTE_SELECTOR + ' {' +
      'background-color: #eeeeee;' +
      'padding: 0em 1em 0em 1em;' +
      'border: solid 1px;' +
      'font-size: 90%;' +
      'font-family: Helvetica, Sans-serif;' +
      'line-height: 1.4;' +
      '-moz-border-radius: .5em;' +
      '-webkit-border-radius: .5em;' +
      'border-radius: .5em;' +
      'opacity: 0.95;' +
      '}' +

      REF_LIST_SELECTOR + ' {' +
      'position: relative !important;' +
      '}' +

      ABOUT_INDICATOR_SELECTOR + ' {' +
      'position: absolute !important;' +
      'right: 1px !important;' +
      'top: 1px !important;' +
      'cursor: pointer !important;' +
      'background-color: #2196F3;' +
      'color: #ffffff;' +
      'width: 17px;' +
      'height: 17px;' +
      'line-height: 17px;' +
      'font-size: 10px;' +
      'text-align: center;' +
      'margin: 0;' +
      'padding: 0;' +
      '}';

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
  style.innerText = DEFAULT_CSS;
  let head = document.getElementsByTagName('head')[0];
  if (head) {
    head.insertBefore(style, head.firstChild);
  } else {
    document.rootElement.insertBefore(style, document.rootElement.firstChild);
  }
  isInitialized = true;
}

function scrollToOwnTop() {
  const startX = window.scrollX;
  const startY = window.scrollY;
  const rect = this.getBoundingClientRect();
  const endY = rect.top + window.pageYOffset;
  const startTime = window.performance.now();
  const duration = 200; // 0.2 sec

  window.requestAnimationFrame(function scrollTo(now) {
    let ratio = (now - startTime) / duration;
    ratio = (ratio > 1.0) ? 1.0 : ratio;
    const y = startY + (endY - startY) * ratio;
    window.scrollTo(startX, y);

    if (ratio != 1.0) {
      window.requestAnimationFrame(scrollTo);
    }
  });
}

const FloatingNote = function() {
  let instance = document.querySelector(FLOATING_NOTE_SELECTOR);
  if (instance) {
    return instance;
  }

  instance = document.createElement('div');
  instance.setAttribute('id', FLOATING_NOTE_ID);
  instance.style.cssText = 'position: absolute !important;';
  instance.hidden = true;
  document.body.appendChild(instance);

  const originalOpacity = (instance.style.opacity) ? instance.style.opacity : 1.0;
  instance.show = function(event) {
    const rect = event.data.element.getBoundingClientRect();
    let left = rect.left + rect.width + window.pageXOffset;
    const top = rect.top + rect.height + window.pageYOffset;

    // TODO: measure actual instance size instead of 420px
    if (left + 420 > window.innerWidth) {
        left = window.innerWidth - 420;
    }

    instance.isAnimating = false;

    instance.innerHTML = event.data.text;

    instance.style.left = `${left}px`;
    instance.style.top = `${top}px`;
    instance.style.opacity = originalOpacity;
    instance.hidden = false;
  };

  instance.hide = function() {
    const delay = 500; // 0.5 sec
    const start = window.performance.now();
    const duration = 1000; // 1 sec

    instance.isAnimating = true;
    window.requestAnimationFrame(function fadeOut(now) {
      if (!instance.isAnimating) {
        return;
      }
      const progress = now - start - delay;
      if (progress < 0) {
        window.requestAnimationFrame(fadeOut);
        return;
      }
      let opacity = originalOpacity * (1 - progress / duration);
      opacity = (opacity < 0) ? 0 : opacity;
      instance.style.opacity = opacity;

      if (progress < duration) {
        window.requestAnimationFrame(fadeOut);
      } else {
        instance.hidden = true;
        instance.isAnimating = false;
      }
    });
  };
  return instance;
}

let objectNumber = 0;
let floatingNote = null;
function initFloatingNote() {
  if (floatingNote !== null) {
    return;
  }
  floatingNote = new FloatingNote();
}

class Note {
  constructor(parent, index, originalElement) {
    this.index = index;
    this.originalElement = originalElement;
    this.reference = `${parent._objectNumber}_${index}`;
    this.barenoteElement = this._makeBarenoteElement();
    this.listElement = this._makeListElement();
  }

  _makeBarenoteElement(reference) {
    const barenoteElement = document.createElement('a');
    barenoteElement.innerText = `${this.index + 1}`;
    barenoteElement.setAttribute('id', `fnref:${this.reference}`);
    barenoteElement.setAttribute('href', `#fn:${this.reference}`);
    barenoteElement.setAttribute('class', REF_CLASS);
    barenoteElement.addEventListener('mouseover', (event) => {
      event.data = {element: barenoteElement, text: this.originalElement.innerHTML};
      floatingNote.show(event);
    });
    barenoteElement.addEventListener('mouseout', (event) => {
      floatingNote.hide();
    });
    barenoteElement.addEventListener('click', (event) => {
      this.listElement.scrollToOwnTop();

      // Cancel Event
      event.stopPropagation();
      event.preventDefault();
    });
    barenoteElement.scrollToOwnTop = scrollToOwnTop;
    return barenoteElement;
  }

  _makeListElement() {
    const arrowElement = document.createElement('a');
    arrowElement.setAttribute('href', `#fnref:${this.reference}`);
    arrowElement.innerHTML = '&#8617;';
    arrowElement.addEventListener('click', (event) => {
      this.barenoteElement.scrollToOwnTop();

      // Cancel Event
      event.stopPropagation();
      event.preventDefault();
    });
    const listElement = document.createElement('li');
    listElement.setAttribute('id', `fn:${this.reference}`);
    listElement.innerHTML = `${this.originalElement.innerHTML}&nbsp;`;
    listElement.appendChild(arrowElement);
    listElement.scrollToOwnTop = scrollToOwnTop;
    return listElement;
  }
}

export default class Barenote {
  constructor(rootElement) {
    initStyle();
    initFloatingNote();

    this._notes = [];
    this._rootElement = rootElement;
    this._objectNumber = objectNumber;
    objectNumber++;

    const refListElement = rootElement.querySelector(REF_LIST_SELECTOR);
    this._barenoteRefList = document.createElement('ol');
    if (refListElement) {
      refListElement.appendChild(this._barenoteRefList);

      // Add About indicator
      Barenote._setAboutIndicator(refListElement);
    }

    for (const [index, el] of rootElement.querySelectorAll(REF_SELECTOR).entries()) {
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
    aboutIndicatorElement.setAttribute('class', ABOUT_INDICATOR_CLASS);
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