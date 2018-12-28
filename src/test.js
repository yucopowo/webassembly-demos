const cmark = require('cmark-emscripten')
const md = require('./test.md');

async function parse(text) {
    console.time('cmark');
    const html = await cmark.toHTML(md);
    console.timeEnd('cmark');
    return html;
}

function render(html) {
    console.time('render');
    const app = document.getElementById('app');
    app.innerHTML = html;
    console.timeEnd('render');
}

(async function () {

    await parse(md);
    await parse(md);
    await parse(md);
    await parse(md);

    const html = await parse(md);


    render(html);


})();