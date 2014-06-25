require('insert-css')('.fancy-text {  position: relative;}.fancy-text .inner {  text-align: center;  position: absolute;  top: 0;  left: 0;  width: 100%;  opacity: 1;  transition: opacity 0.3s cubic-bezier(0.4, 0, 0, 1);  word-wrap: break-word;}.fancy-text .inner.fade {  opacity: 0;}.fancy-text .word {  display: inline-block;  transition: all 0.5s cubic-bezier(0.4, 0, 0, 1);  opacity: 1;  margin-right: 0.2em;}.fancy-text .word.float {  opacity: 0;  -webkit-transform: translate3d(0, 10px, 0);  -moz-transform: translate3d(0, 10px, 0);  transform: translate3d(0, 10px, 0);}.fancy-text .word.fade {  opacity: 0;}.fancy-text .word.slide-left {  opacity: 0;  -webkit-transform: translate3d(20px, 0, 0);  -moz-transform: translate3d(20px, 0, 0);  transform: translate3d(20px, 0, 0);}.fancy-text .word.slide-right {  opacity: 0;  -webkit-transform: translate3d(-20px, 0, 0);  -moz-transform: translate3d(-20px, 0, 0);  transform: translate3d(-20px, 0, 0);}')

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