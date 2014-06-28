require('insert-css')(require('./fancytext.styl'))

var transitionend = require('transitionend-property')

function FancyText (options) {
    options = options || {}
    this.el = options.el || document.createElement('div')
    this.el.classList.add('fancy-text')
    this.interval = options.interval || 50
    this.effect = options.effect || 'float'
}

FancyText.prototype.setText = function (text, cb) {
    if (this.text === text) return
    this.text = text
    this.cb = cb
    this.words = text.split(' ')
    this.fadeCurrent()
    this.fadeInNew()
}

FancyText.prototype.fadeCurrent = function () {
    var el = this.el,
        cur = this.currentWords
    if (!cur) return
    cur.classList.add('fade')
    cur.addEventListener(transitionend, onEnd)
    function onEnd () {
        cur.removeEventListener(transitionend, onEnd)
        el.removeChild(cur)
    }
}

FancyText.prototype.fadeInNew = function () {
    
    var newWords = this.currentWords = document.createElement('div'),
        interval = this.interval,
        total    = this.words.length,
        cb       = this.cb,
        effect   = this.effect,
        lastEl   = null

    newWords.classList.add('inner')
    this.el.appendChild(newWords)

    this.words.forEach(function (w, i) {
        var wordEl = document.createElement('span')
        wordEl.textContent = w
        wordEl.className = 'word ' + effect
        newWords.appendChild(wordEl)
        var id = setTimeout(function () {
            wordEl.classList.remove(effect)
            if (cb && i >= total - 1) {
                lastEl = wordEl
                wordEl.addEventListener(transitionend, onEnd)
            }
        }, (i + 1) * interval)
    })

    function onEnd () {
        lastEl.removeEventListener(transitionend, onEnd)
        cb()
    }
}

module.exports = FancyText