export default Object.freeze({
    REF_CLASS: 'barenote',
    get REF_SELECTOR() { return `.${this.REF_CLASS}` },
    REF_LIST_CLASS: 'barenote_ref_list',
    get REF_LIST_SELECTOR() { return `.${this.REF_LIST_CLASS}` },
    FLOATING_NOTE_ID: 'barenote_floating_note',
    get FLOATING_NOTE_SELECTOR() { return `#${this.FLOATING_NOTE_ID}` },
    ABOUT_INDICATOR_CLASS: 'barenote_about_indicator',
    get ABOUT_INDICATOR_SELECTOR() { return `.${this.ABOUT_INDICATOR_CLASS}` },
    get DEFAULT_CSS() {
        return this.FLOATING_NOTE_SELECTOR + ' {' +
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
  
        this.REF_LIST_SELECTOR + ' {' +
        'position: relative !important;' +
        '}' +
  
        this.ABOUT_INDICATOR_SELECTOR + ' {' +
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
        '}'
    }
})