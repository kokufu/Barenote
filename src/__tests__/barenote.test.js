'use strict';

const fs = require('fs');
const path = require('path');
import Barenote from '../barenote'

beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), {encoding: 'utf-8'});
    document.write(html);
})

test('Constructor replaces text to number', () => {
    const body = document.querySelector('body');
    new Barenote(body);
    const allBarenotes = body.querySelectorAll('.barenote');
    expect(allBarenotes.length).toBe(2);
    for (const [index, el] of allBarenotes.entries()) {
        expect(el.innerText).toEqual((index + 1).toString(10));
    }
})

test('Constructor makes footnote lists', () => {
    const body = document.querySelector('body');
    const allBarenotes = body.querySelectorAll('.barenote');
    new Barenote(body);
    for (const [index, el] of body.querySelectorAll('.barenote_ref_list ol li').entries()) {
        expect(el.innerText).toEqual(allBarenotes[index].innerText)
    }
})
