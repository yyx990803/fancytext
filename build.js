var fs = require('fs'),
    stylus = require('stylus')

var js = fs.readFileSync('lib/fancytext.js', 'utf-8'),
    styl = fs.readFileSync('lib/fancytext.styl', 'utf-8')

stylus.render(styl, function (err, css) {
    if (err) throw err
    css = css.replace(/\n/g, '')
    js = "require('insert-css')('" + css + "')\n\n" + js
    fs.writeFile('index.js', js)
})