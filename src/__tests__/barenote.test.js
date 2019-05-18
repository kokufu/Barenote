'use strict';

const fs = require('fs');
const path = require('path');
import Barenote from '../barenote'

test('Constructor replaces text to number', () => {
    const html = fs.readFileSync(path.resolve(__dirname, 'index.html'), {encoding: 'utf-8'});
    document.write(html);
    const body = document.querySelector('body');
    new Barenote(body);

    const allElements = body.querySelectorAll('.barenote');
    expect(allElements.length).toBe(2);
    for (const [index, el] of allElements.entries()) {
        expect(el.innerText).toEqual((index + 1).toString(10));
    }
});
